# Qwen AI Chatbot

تطبيق دردشة ذكي متطور يجمع بين واجهة مستخدم أنيقة وقدرات الذكاء الاصطناعي المتقدمة من Alibaba Cloud.

## المميزات

- **واجهة دردشة تفاعلية**: تصميم عصري وأنيق مع دعم المحادثات المتعددة
- **ذكاء اصطناعي متقدم**: يستخدم نموذج Qwen-plus من Alibaba Cloud DashScope
- **حفظ المحادثات**: جميع المحادثات تُحفظ تلقائياً في قاعدة البيانات
- **مصادقة آمنة**: نظام مصادقة Manus OAuth مدمج
- **عرض Markdown**: دعم كامل لعرض محتوى Markdown في الردود
- **تصميم متجاوب**: يعمل بشكل مثالي على جميع الأجهزة

## المتطلبات

- Node.js 22.x أو أحدث
- pnpm 10.x أو أحدث
- MySQL أو TiDB لقاعدة البيانات
- مفتاح API من Alibaba Cloud DashScope

## البدء السريع

### 1. التثبيت

```bash
git clone <repository-url>
cd qwen-chatbot
pnpm install
```

### 2. إعداد متغيرات البيئة

قم بإنشاء ملف `.env` في جذر المشروع:

```env
DATABASE_URL=mysql://user:password@localhost:3306/qwen_chatbot
DASHSCOPE_API_KEY=sk-your-api-key-here
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### 3. إعداد قاعدة البيانات

```bash
pnpm db:push
```

### 4. تشغيل التطبيق

```bash
pnpm dev
```

سيكون التطبيق متاحاً على `http://localhost:3000`

## البنية المعمارية

### Frontend (React + Tailwind CSS)

- **Home.tsx**: الصفحة الرئيسية مع معلومات عن التطبيق
- **ChatPage.tsx**: واجهة الدردشة الرئيسية

### Backend (Express + tRPC)

- **server/routers/chat.ts**: جميع procedures الخاصة بالدردشة
- **server/dashscope-service.ts**: خدمة التواصل مع Alibaba Cloud API
- **server/db.ts**: query helpers لقاعدة البيانات

### قاعدة البيانات

- **users**: جدول المستخدمين
- **conversations**: جدول المحادثات
- **messages**: جدول الرسائل

## API Endpoints

### Chat Procedures

#### `chat.createConversation`
إنشاء محادثة جديدة

**Input:**
```typescript
{
  title?: string
}
```

#### `chat.getConversations`
الحصول على جميع محادثات المستخدم

**Output:**
```typescript
Conversation[]
```

#### `chat.sendMessage`
إرسال رسالة والحصول على رد من AI

**Input:**
```typescript
{
  conversationId?: number
  message: string
}
```

**Output:**
```typescript
{
  conversationId: number
  userMessage: string
  aiResponse: string
}
```

#### `chat.getMessages`
الحصول على رسائل محادثة معينة

**Input:**
```typescript
{
  conversationId: number
}
```

**Output:**
```typescript
Message[]
```

## تكنولوجيا مستخدمة

### Frontend
- **React 19**: مكتبة واجهات المستخدم
- **Tailwind CSS 4**: نظام التصميم
- **Wouter**: توجيه الصفحات
- **Streamdown**: عرض Markdown
- **Lucide React**: أيقونات

### Backend
- **Express**: خادم الويب
- **tRPC**: طبقة RPC آمنة النوع
- **Drizzle ORM**: إدارة قاعدة البيانات
- **Axios**: طلبات HTTP

### Database
- **MySQL/TiDB**: قاعدة البيانات الرئيسية

## الاختبار

تشغيل جميع الاختبارات:

```bash
pnpm test
```

تشغيل اختبار معين:

```bash
pnpm test -- server/dashscope.test.ts
```

## البناء للإنتاج

```bash
pnpm build
pnpm start
```

## الملفات الرئيسية

```
qwen-chatbot/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── ChatPage.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── routers/
│   │   ├── chat.ts
│   │   └── chat.test.ts
│   ├── dashscope-service.ts
│   ├── db.ts
│   └── routers.ts
├── drizzle/
│   └── schema.ts
└── README.md
```

## نموذج البيانات

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  title VARCHAR(255) DEFAULT 'New Conversation',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversationId INT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE
);
```

## الأمان

- جميع المحادثات محمية بنظام مصادقة Manus OAuth
- مفتاح API الخاص بـ Alibaba Cloud محفوظ في متغيرات البيئة
- جميع الاتصالات مشفرة بـ HTTPS
- الرسائل تُحفظ بشكل آمن في قاعدة البيانات

## الأداء

- تحميل سريع للصفحات بفضل React و Vite
- استجابة سريعة من AI بفضل نموذج Qwen-plus
- تخزين مؤقت ذكي للمحادثات
- تحسين الصور والموارد

## المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت MIT License - انظر ملف LICENSE للتفاصيل.

## الدعم

للحصول على الدعم أو الإبلاغ عن المشاكل، يرجى فتح Issue في المستودع.

## الشكر والتقدير

- Alibaba Cloud لتوفير نموذج Qwen-plus
- Manus لمنصة التطوير والاستضافة
- المجتمع مفتوح المصدر على المكتبات الرائعة

---

تم بناء هذا المشروع بـ ❤️ باستخدام تقنيات حديثة وأفضل الممارسات.
