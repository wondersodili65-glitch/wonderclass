# 🔧 TROUBLESHOOTING GUIDE

## ❌ Issues & Solutions

### **Issue 1: Login isn't working**

#### **Symptom:** 
- Click login but nothing happens
- Or redirects back to same page

#### **Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Try in different browser
4. Clear cache: Ctrl+F5
5. Verify `js/auth.js` is loaded
6. Check email matches exactly (case sensitive)

---

### **Issue 2: Data not saving**

#### **Symptom:**
- Create account but can't login next visit
- Profile edits disappear after refresh

#### **Solution:**
1. Check browser storage (F12 → Application → Storage → LocalStorage)
2. Look for `enny_users` and `enny_current_user` keys
3. If missing: Browser might not support localStorage
4. Try different browser
5. Disable privacy/incognito mode
6. Check browser permissions aren't blocking storage

#### **Check Storage Command:**
```javascript
// Paste in console (F12):
console.log(JSON.parse(localStorage.getItem('enny_users')))
```

---

### **Issue 3: Buttons don't work on Patient Resources page**

#### **Symptom:**
- Click "Login" button but nothing happens
- Page alerts appear

#### **Solution:**
1. Verify `js/auth.js` is loaded (F12 → Sources)
2. Check that `updateLoginSection()` is called on page load
3. Verify `login.html` file exists
4. Try hard refresh (Ctrl+F5)
5. Check browser console for errors

---

### **Issue 4: Dashboard shows "Not logged in" error**

#### **Symptom:**
- Login successful but redirects to home instead of dashboard
- Or dashboard shows redirect message

#### **Solution:**
1. Check `patient-dashboard.html` redirects you
2. Verify login redirect points to `patient-dashboard.html`
3. Check current URL is exactly: `patient-dashboard.html`
4. Clear browser cache
5. Try in private/incognito window

---

### **Issue 5: Can't see Login link in header**

#### **Symptom:**
- Header doesn't show "Login" button
- Header doesn't show user menu when logged in

#### **Solution:**
1. Check `js/auth.js` exists and loads before `js/main.js`
2. Verify `updateAuthNavigation()` function exists
3. Check that `<script src="js/auth.js"></script>` is in HTML
4. Hard refresh page (Ctrl+F5)
5. Check console for errors

---

### **Issue 6: Account created but can't find it on login**

#### **Symptom:**
- Create account with "john@example.com"
- Try to login with "john@example.com"
- Says account doesn't exist

#### **Solution:**
1. Check email matches exactly (case sensitive)
2. Verify password is correct (case sensitive)
3. Check localStorage for saved account:
   ```javascript
   // Paste in console:
   JSON.parse(localStorage.getItem('enny_users'))
   ```
4. If account not in list: Creation failed (check console)
5. If account in list: Try exact same password

---

### **Issue 7: localStorage full**

#### **Symptom:**
- Error: "QuotaExceededError"
- Can't save new accounts or appointments

#### **Solution:**
1. Clear old test data: `localStorage.clear()`
2. Delete specific key:
   ```javascript
   localStorage.removeItem('enny_users')
   localStorage.removeItem('enny_current_user')
   ```
3. Browser storage limit: Usually 5-10MB (plenty for this)
4. Try different browser

---

### **Issue 8: Password isn't saving/working**

#### **Symptom:**
- Create account with "password123"
- Login with "password123" fails

#### **Solution:**
1. Check for extra spaces in password
2. Verify Caps Lock is off
3. Note: System is case-sensitive
4. View saved password in browser storage:
   ```javascript
   JSON.parse(localStorage.getItem('enny_users'))[0].password
   ```
5. Compare with what you're typing

---

### **Issue 9: Logout not working**

#### **Symptom:**
- Click logout but still logged in
- Or page doesn't update

#### **Solution:**
1. Check `logout()` function in `js/auth.js`
2. Verify user menu has logout button
3. Check console for JavaScript errors
4. Try manual logout:
   ```javascript
   localStorage.removeItem('enny_current_user')
   location.reload()
   ```

---

### **Issue 10: Multiple users confusing**

#### **Symptom:**
- Created multiple accounts but mixed up data
- Don't know which account is logged in

#### **Solution:**
1. Check console:
   ```javascript
   JSON.parse(localStorage.getItem('enny_current_user')).email
   ```
2. Look at dashboard welcome message
3. View header shows currently logged-in user
4. Logout and login again to be sure

---

## 🛠️ Debug Commands

### **Run these in browser console (F12):**

```javascript
// Check ALL users
JSON.parse(localStorage.getItem('enny_users'))

// Check currently logged-in user
JSON.parse(localStorage.getItem('enny_current_user'))

// Check if authSystem is loaded
typeof authSystem

// Check if user is logged in
authSystem.isLoggedIn()

// Get current user
authSystem.getCurrentUser()

// Clear all accounts
localStorage.clear()

// Test login manually
authSystem.login('test@example.com', 'password123')

// See login result
authSystem.getCurrentUser()
```

---

## 📋 Quick Verification Checklist

- [ ] `js/auth.js` file exists
- [ ] `pages/login.html` file exists
- [ ] `pages/patient-dashboard.html` file exists
- [ ] `pages/patient-resources.html` file exists
- [ ] Browser allows JavaScript
- [ ] Browser allows localStorage
- [ ] No console errors (F12)
- [ ] Page hard-refreshed (Ctrl+F5)

---

## 🌐 Testing on Different Environments

### **Local Computer:**
- Works in: Chrome, Firefox, Safari, Edge
- Open `index.html` in browser

### **GitHub Pages:**
- Works on: All modern browsers
- Data persists: Within browser session
- No backend needed

### **Mobile Phone:**
- Works on: Mobile Safari, Chrome
- Test URL on phone browser
- Touch buttons work same as desktop

---

## 📞 Common Support Messages

### **"Email not found"**
- Check email spelling matches exactly
- Check email is used for signup (not different email)

### **"Wrong password"**
- Check Caps Lock is off
- Check password spelling matches exactly
- Copy-paste from email to verify

### **"Account already exists"**
- This email is already registered
- Try different email
- Or logout and login to existing account

### **"Passwords don't match"**
- Password and Confirm password fields differ
- Sometimes triggered by extra space
- Type both exactly same

---

## 🔍 How to Read Browser Console

1. Press F12 to open Developer Tools
2. Click "Console" tab
3. You should see no errors (or red icons)
4. If errors appear, read them to get hints
5. Copy error message and try solution above

---

## ✅ System is Working When:

✅ Can create account at `pages/login.html`  
✅ Data saved to localStorage  
✅ Can login with saved account  
✅ Dashboard shows personal info  
✅ Can edit profile  
✅ Can add appointments  
✅ Logout clears session  
✅ Can login again with same account  
✅ Link on patient-resources page works  
✅ No console errors  

---

## 🚀 If Everything Fails

**Nuclear Option - Clear Everything and Restart:**

```javascript
// Clear all data
localStorage.clear()

// Restart browser
// Close and reopen browser

// Create new test account
// Test login again
```

---

## 📞 Support Contacts

For issues with the hospital website:
- Phone: **08039433142** (Main)
- Phone: **09023840750** (Emergency)
- Email: **ikwulonoisaac1979@gmail.com**

---

**Remember:** This is a browser-based demo authentication system. Data is stored locally on each computer, not on a server.
