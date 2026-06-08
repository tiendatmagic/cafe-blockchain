const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/components/settings/settings.component.html');
let content = fs.readFileSync(filePath, 'utf8');

// Target dở dang cần vá
const target = `                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"`;

const replacement = `                <path
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
  }`;

// Chuẩn hóa xuống dòng để so khớp chính xác
const normalizedTarget = target.replace(/\r\n/g, '\n');
const normalizedReplacement = replacement.replace(/\r\n/g, '\n');
const normalizedContent = content.replace(/\r\n/g, '\n');

// Sử dụng lastIndexOf để tìm lần xuất hiện cuối cùng (chính là ở tab store)
const lastIndex = normalizedContent.lastIndexOf(normalizedTarget);

if (lastIndex !== -1) {
  content = normalizedContent.substring(0, lastIndex) + 
            normalizedReplacement + 
            normalizedContent.substring(lastIndex + normalizedTarget.length);
  console.log("Syntax patch applied successfully at the last occurrence (tab store)!");
} else {
  console.log("ERROR: Target syntax not found!");
}

// Thêm thẻ đóng div ngoài cùng ở cuối file nếu chưa có
const normalizedContentTrimmed = content.trim();
if (!normalizedContentTrimmed.endsWith('</div>')) {
  content = content + '\n</div>\n';
  console.log("Outer closed div appended to the end of file!");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("File patch process finished!");
