import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

// Bộ nhớ đệm in-memory lưu trữ response
const cacheMap = new Map<string, { response: HttpResponse<any>; expireAt: number }>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Invalidate Cache khi có request ghi dữ liệu (POST, PUT, DELETE)
  if (req.method !== 'GET') {
    const url = req.url.toLowerCase();
    const keysToRemove: string[] = [];

    cacheMap.forEach((val, key) => {
      // Invalidate thực đơn & danh mục
      if (url.includes('/products') || url.includes('/categories')) {
        if (key.includes('/products') || key.includes('/categories')) {
          keysToRemove.push(key);
        }
      }
      // Invalidate nhân viên & quyền
      else if (url.includes('/staffs') || url.includes('/roles')) {
        if (key.includes('/staffs') || key.includes('/roles')) {
          keysToRemove.push(key);
        }
      }
      // Invalidate khu vực & bàn ăn
      else if (url.includes('/areas') || url.includes('/dining-tables')) {
        if (key.includes('/areas') || key.includes('/dining-tables')) {
          keysToRemove.push(key);
        }
      }
      // Invalidate khách hàng & nhóm khách hàng
      else if (url.includes('/customers') || url.includes('/customer-groups')) {
        if (key.includes('/customers') || key.includes('/customer-groups')) {
          keysToRemove.push(key);
        }
      }
      // Invalidate cấu hình & phương thức thanh toán
      else if (url.includes('/settings') || url.includes('/payment-methods')) {
        if (key.includes('/settings') || key.includes('/payment-methods')) {
          keysToRemove.push(key);
        }
      }

      // Invalidate dashboard khi có thay đổi đơn hàng, ca trực, thu chi (ảnh hưởng số liệu tổng quan)
      if (url.includes('/orders') || url.includes('/transactions') || url.includes('/shifts')) {
        if (key.includes('/dashboard')) {
          keysToRemove.push(key);
        }
      }
    });

    keysToRemove.forEach((key) => cacheMap.delete(key));
    return next(req);
  }

  // 2. Xử lý cache cho request GET
  const bypassCache = req.headers.get('X-Bypass-Cache') === 'true';
  const ttlHeader = req.headers.get('X-Cache-TTL');
  if (!ttlHeader) {
    return next(req);
  }

  const ttl = Number(ttlHeader);
  const cacheKey = req.urlWithParams;

  // Xóa các custom headers trước khi gửi lên Laravel Backend
  let cleanHeaders = req.headers.delete('X-Cache-TTL');
  if (bypassCache) {
    cleanHeaders = cleanHeaders.delete('X-Bypass-Cache');
    cacheMap.delete(cacheKey); // Xóa cache cũ nếu có yêu cầu force reload
  }

  const cleanReq = req.clone({
    headers: cleanHeaders
  });

  if (!bypassCache) {
    const cached = cacheMap.get(cacheKey);
    const now = Date.now();

    if (cached) {
      // Nếu cache vĩnh viễn (ttl === -1) hoặc chưa hết hạn
      if (cached.expireAt === -1 || cached.expireAt > now) {
        return of(cached.response.clone());
      } else {
        cacheMap.delete(cacheKey); // Xóa cache hết hạn
      }
    }
  }

  // Gửi request thật và lưu kết quả vào cache
  return next(cleanReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const expireAt = ttl === -1 ? -1 : Date.now() + ttl;
        cacheMap.set(cacheKey, {
          response: event.clone(),
          expireAt: expireAt
        });
      }
    })
  );
};
