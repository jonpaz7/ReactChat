export const users = [];
export const chats = [];
export const messagess = [];

/* ========================================================
   רשימת כל הפונקציות מתוך ChatContext.jsx
   ======================================================== */

// 1. טעינת מידע ראשונית מה-localStorage (למשתמשים, צ'אטים, הודעות)
// function loadData(storageKey)

// 2. יצירת חשבון משתמש חדש (בודק כפילות שם, מייצר userId ב-UUID, שומר avatar ו-setUsers)
// const createAccount = ({ userName, userPassword })

// 3. התחברות לחשבון קיים (בודק התאמת שם וסיסמה, מעדכן loggedInUsername)
// const loginAccount = ({ userName, userPassword })

// 4. פתיחת צ'אט (בודק אם כבר קיים צ'אט בין המחובר למשתמש היעד; אם לא קיים - יוצר חדש, ומעדכן openedChatId)
// const openChat = (userId)

// 5. יצירת צ'אט חדש בפועל (מייצר chatId ב-UUID, מוסיף לרשימת participants את שני המשתמשים ודוחף ל-chats)
// const createChat = (userId)

// 6. שליחת הודעה (מייצרת messageId ב-UUID, סוג, תוכן, chatId, senderId, ודוחפת ל-messages)
// const sendMessage = (chatId, messageType, messageContent)

// 7. עריכת תוכן הודעה קיימת (מחפשת לפי msgId ומעדכנת את content)
// const editMessage = (msgId, newContent)

// 8. מחיקת/הסתרת הודעה (אם deleteMode === "hide" - הופכת ל-isHidden: true ומוסיפה deleterId ל-Set)
// const deleteMessage = (msgId, deleteMode, deleterId)
