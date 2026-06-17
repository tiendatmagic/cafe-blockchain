const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/components/settings/settings.component.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Thêm button tab "Website Cửa hàng" vào sub-tabs navigation
const tabTarget = `    <button
      type="button"
      (click)="setSettingsSubTab('permissions')"
      [class]="
        'flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 active:scale-95 border ' +
        (settingsSubTab() === 'permissions'
          ? 'bg-white dark:bg-slate-900 border-slate-200/40 dark:border-slate-800/60 text-[var(--dynamic-primary)] shadow-sm'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4.5 w-4.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <span>Ủy quyền nhân sự (Ví)</span>
    </button>
  </div>`;

const tabReplacement = `    <button
      type="button"
      (click)="setSettingsSubTab('permissions')"
      [class]="
        'flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 active:scale-95 border ' +
        (settingsSubTab() === 'permissions'
          ? 'bg-white dark:bg-slate-900 border-slate-200/40 dark:border-slate-800/60 text-[var(--dynamic-primary)] shadow-sm'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4.5 w-4.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <span>Ủy quyền nhân sự (Ví)</span>
    </button>

    <button
      type="button"
      (click)="setSettingsSubTab('store')"
      [class]="
        'flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 active:scale-95 border ' +
        (settingsSubTab() === 'store'
          ? 'bg-white dark:bg-slate-900 border-slate-200/40 dark:border-slate-800/60 text-[var(--dynamic-primary)] shadow-sm'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4.5 w-4.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
      <span>Website Cửa hàng</span>
    </button>
  </div>`;

// 2. Thêm nội dung cấu hình tab store vào cuối phần tab settings (ngay trước confirm modals)
const blockTarget = `            </div>
          }
        </div>
      </div>
    </div>
  }
</div>

<!-- ==================== CONFIRM MODALS MỤC CONFIG ==================== -->`;

const storeBlockText = `            </div>
          }
        </div>
      </div>
    </div>
  }

  <!-- Tab 6: Website Cửa hàng -->
  @if (settingsSubTab() === 'store') {
    <div
      class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6 transition-colors duration-300 w-full animate-in fade-in duration-200"
    >
      <div
        class="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/60"
      >
        <div class="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </div>
        <h4 class="text-md font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          Cấu hình Website Cửa hàng
        </h4>
      </div>

      <div class="space-y-6">
        <!-- Nhập Slug website -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-wide block"
            >Đường dẫn Slug website cửa hàng</label
          >
          <div class="relative">
            <input
              type="text"
              [ngModel]="configForm().website_slug"
              (ngModelChange)="updateConfigForm('website_slug', $event)"
              placeholder="Ví dụ: cafe-web3"
              [disabled]="!web3Service.walletConnected() || !web3Service.isOwnerContract()"
              class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--dynamic-primary)] text-slate-800 dark:text-white disabled:opacity-50"
            />
          </div>
          <span class="text-xs text-slate-400 font-medium block leading-tight">
            * Nhập slug duy nhất đại diện cho quán (Ví dụ: <code>cafe-web3</code>). Nếu bỏ trống và lưu, hệ thống sẽ tự sinh slug không dấu dựa trên tên quán kèm chữ cái ngẫu nhiên.
          </span>
        </div>

        <!-- Đường dẫn liên kết cửa hàng -->
        @if (configForm().website_slug) {
          <div
            class="p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/10 dark:border-purple-800/40 space-y-2"
          >
            <span class="text-xs font-bold text-purple-600 dark:text-purple-400 block uppercase tracking-wide"
              >Đường dẫn website của quán bạn:</span
            >
            <div class="flex items-center gap-2">
              <a
                [href]="getFullStoreLink()"
                target="_blank"
                class="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[var(--dynamic-primary)] transition-colors truncate underline"
              >
                {{ getFullStoreLink() }}
              </a>
              <button
                type="button"
                (click)="copyStoreLink()"
                class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors shrink-0"
                title="Sao chép liên kết"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          </div>
        }

        <!-- Chọn danh mục hiển thị trên Storefront -->
        <div class="border-t border-slate-100 dark:border-slate-800/60 pt-5 space-y-3">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wide block"
                >Danh mục sản phẩm hiển thị trên Web Store</span
              >
              <span class="text-[11px] text-slate-400 font-semibold block leading-tight mt-0.5">
                Chỉ những danh mục được chọn dưới đây mới được hiển thị cho khách mua hàng trực tuyến.
              </span>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                (click)="selectAllCategories()"
                [disabled]="!web3Service.walletConnected() || !web3Service.isOwnerContract()"
                class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800/80 text-xs font-bold text-[var(--dynamic-primary)] transition-all border border-slate-200 dark:border-slate-800 disabled:opacity-50 active:scale-95"
              >
                Chọn tất cả
              </button>
              <button
                type="button"
                (click)="clearAllCategories()"
                [disabled]="!web3Service.walletConnected() || !web3Service.isOwnerContract()"
                class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800/80 text-xs font-bold text-rose-500 transition-all border border-slate-200 dark:border-slate-800 disabled:opacity-50 active:scale-95"
              >
                Bỏ chọn hết
              </button>
            </div>
          </div>

          <!-- Danh sách Checkboxes danh mục -->
          @if (categoriesList().length === 0) {
            <p class="text-xs text-slate-400 italic py-2 text-center">
              Chưa có danh mục sản phẩm nào được tạo. Vui lòng tạo danh mục ở mục Thực đơn trước!
            </p>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              @for (category of categoriesList(); track category.id) {
                <div
                  (click)="
                    !web3Service.walletConnected() || !web3Service.isOwnerContract()
                      ? null
                      : toggleCategorySelection(category.id)
                  "
                  [class]="
                    'flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ' +
                    (isCategorySelected(category.id)
                      ? 'border-[var(--dynamic-primary)] bg-[var(--dynamic-primary)]/5 dark:bg-[var(--dynamic-primary)]/10 text-slate-800 dark:text-white'
                      : 'border-slate-100 dark:border-slate-950 hover:border-slate-200 dark:hover:border-slate-800 text-slate-500') +
                    (!web3Service.walletConnected() || !web3Service.isOwnerContract()
                      ? ' opacity-50 cursor-not-allowed'
                      : '')
                  "
                >
                  <div
                    [class]="
                      'w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ' +
                      (isCategorySelected(category.id)
                        ? 'bg-[var(--dynamic-primary)] border-[var(--dynamic-primary)] text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900')
                    "
                  >
                    @if (isCategorySelected(category.id)) {
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    }
                  </div>
                  <span class="text-xs font-bold leading-none truncate">{{ category.name }}</span>
                </div>
              }
            </div>
          }
        </div>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <button
            (click)="saveConfig()"
            [disabled]="
              isConfigSaving() || !web3Service.walletConnected() || !web3Service.isOwnerContract()
            "
            class="w-full h-[46px] bg-[var(--dynamic-primary)] hover:opacity-90 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[var(--dynamic-primary)]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            @if (isConfigSaving()) {
              <div
                class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
              ></div>
              <span>ĐANG LƯU CẤU HÌNH...</span>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4.5 w-4.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <span>LƯU CẤU HÌNH HỆ THỐNG</span>
            }
          </button>
        </div>
      </div>
    </div>
  }
</div>

<!-- ==================== CONFIRM MODALS MỤC CONFIG ==================== -->`;

// Xử lý xuống dòng thống nhất
const normalizedTabTarget = tabTarget.replace(/\r\n/g, '\n');
const normalizedTabReplacement = tabReplacement.replace(/\r\n/g, '\n');
const normalizedBlockTarget = blockTarget.replace(/\r\n/g, '\n');
const normalizedStoreBlockText = storeBlockText.replace(/\r\n/g, '\n');
let normalizedContent = content.replace(/\r\n/g, '\n');

// 1. Patch Tab Navigation
if (normalizedContent.includes(normalizedTabTarget)) {
  normalizedContent = normalizedContent.replace(normalizedTabTarget, normalizedTabReplacement);
  console.log("Tab navigation patched successfully!");
} else {
  console.log("ERROR: tabTarget not found!");
}

// 2. Patch Tab Store Block
if (normalizedContent.includes(normalizedBlockTarget)) {
  normalizedContent = normalizedContent.replace(normalizedBlockTarget, normalizedStoreBlockText);
  console.log("Store tab block patched successfully!");
} else {
  console.log("ERROR: blockTarget not found!");
}

// 3. Thêm thẻ đóng div ngoài cùng ở cuối file nếu chưa có
const normalizedContentTrimmed = normalizedContent.trim();
if (!normalizedContentTrimmed.endsWith('</div>')) {
  normalizedContent = normalizedContent + '\n</div>\n';
  console.log("Outer closed div appended to the end of file!");
}

fs.writeFileSync(filePath, normalizedContent, 'utf8');
console.log("File patched clean from HEAD successfully!");
