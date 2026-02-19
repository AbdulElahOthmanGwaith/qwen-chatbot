# Qwen AI Chatbot - Project TODO

## Database & Backend
- [x] تصميم نموذج قاعدة البيانات (جداول conversations و messages)
- [x] إنشاء جداول قاعدة البيانات باستخدام Drizzle ORM
- [x] تنفيذ query helpers في server/db.ts
- [x] دمج Alibaba Cloud DashScope API مع مفتاح API المستخدم
- [x] إنشاء tRPC procedures للدردشة (sendMessage, getConversations, etc.)
- [x] كتابة اختبارات vitest للـ procedures

## Frontend UI & Components
- [x] تصميم واجهة الدردشة الأنيقة (elegant design)
- [x] إنشاء مكون ChatBox التفاعلي
- [x] إنشاء مكون ConversationList لعرض المحادثات السابقة
- [x] إنشاء مكون MessageList لعرض الرسائل
- [x] إنشاء مكون MessageInput لإدخال الرسائل
- [x] دعم عرض Markdown باستخدام Streamdown
- [x] تصميم متجاوب (Responsive Design)
- [x] إضافة حالات التحميل والأخطاء

## Integration & Features
- [x] ربط الواجهة الأمامية بـ tRPC procedures
- [x] دعم حفظ المحادثات في قاعدة البيانات
- [x] دعم استرجاع المحادثات السابقة
- [x] دعم المصادقة والمستخدمين
- [x] إضافة تأثيرات بصرية وحركات (Animations)
- [x] اختبار التطبيق بالكامل

## Deployment & Documentation
- [x] إنشاء ملف README شامل
- [x] إعداد المشروع للرفع على GitHub
- [ ] رفع المشروع إلى GitHub
- [ ] إنشاء checkpoint للمشروع

## Design System
- [x] اختيار نظام الألوان الأنيق
- [x] تحديد الخطوط والأحجام
- [x] إضافة CSS variables في index.css
- [x] تطبيق Tailwind CSS بشكل متسق
