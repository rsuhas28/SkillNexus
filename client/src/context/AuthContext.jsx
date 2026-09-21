import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("skillnexus_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("skillnexus_token");
      if (!storedToken) { setLoading(false); return; }
      try {
        const res = await api.getMe();
        if (res.success && res.user) { setUser(res.user); setProfile(res.profile || null); }
        else { clearSession(); }
      } catch (err) {
        console.warn("Session verification failed:", err.message);
        clearSession();
      } finally { setLoading(false); }
    };
    initAuth();
  }, []);

  const clearSession = () => {
    localStorage.removeItem("skillnexus_token");
    localStorage.removeItem("skillnexus_user");
    setToken(null); setUser(null); setProfile(null);
  };

  const login = async (email, password, remember = true) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem("skillnexus_token", res.token);
      if (!remember) sessionStorage.setItem("skillnexus_token", res.token);
      setToken(res.token); setUser(res.user); setProfile(res.profile || null);
      return res;
    }
    throw new Error(res.message || "Login failed.");
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    if (res.success && res.token) {
      localStorage.setItem("skillnexus_token", res.token);
      setToken(res.token); setUser(res.user); setProfile(res.profile || null);
      return res;
    }
    throw new Error(res.message || "Registration failed.");
  };

  const logout = async () => {
    try {
      await api.logout();
      const { auth, signOut } = await import("../firebase.js");
      await signOut(auth).catch(() => {});
    } catch (e) {
      // ignore network errors
    } finally { clearSession(); }
  };

  const verifyEmail = async (verificationToken, uid) => {
    const res = await api.verifyEmail({ token: verificationToken, uid: uid || user?.uid });
    if (res.success && res.user) {
      setUser(res.user);
      if (res.token) { localStorage.setItem("skillnexus_token", res.token); setToken(res.token); }
    }
    return res;
  };

  const resendVerification = async (email) =>
    await api.resendVerification({ email: email || user?.email });

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.user) { setUser(res.user); setProfile(res.profile || null); }
    } catch (e) { console.warn("Failed to refresh user:", e.message); }
  };

  // ─── Firebase OAuth helpers ──────────────────────────────────────────────

  /**
   * Exchange a Firebase ID token for a SkillNexus JWT.
   * Calls POST /auth/firebase on the backend.
   */
  const _exchangeFirebaseToken = async (firebaseUser, extraData = {}) => {
    const idToken = await firebaseUser.getIdToken();
    const res = await api.firebaseAuth({
      idToken,
      clientEmail: firebaseUser.email,
      clientName: firebaseUser.displayName,
      clientUid: firebaseUser.uid,
      clientPhoto: firebaseUser.photoURL,
      ...extraData
    });
    if (res.success && res.token) {
      localStorage.setItem("skillnexus_token", res.token);
      setToken(res.token); setUser(res.user); setProfile(res.profile || null);
      return res;
    }
    throw new Error(res.message || "Firebase authentication failed.");
  };

  /** Sign in with Google popup */
  const loginWithGoogle = async (roleHint) => {
    const { auth, googleProvider, signInWithPopup } = await import("../firebase.js");
    const result = await signInWithPopup(auth, googleProvider);
    return _exchangeFirebaseToken(result.user, { role: roleHint });
  };

  /** Sign in with GitHub popup */
  const loginWithGithub = async (roleHint) => {
    const { auth, githubProvider, signInWithPopup } = await import("../firebase.js");
    const result = await signInWithPopup(auth, githubProvider);
    return _exchangeFirebaseToken(result.user, { role: roleHint });
  };

  /** Register or sign in with Firebase email/password, then exchange with backend */
  const loginWithFirebase = async (email, password, isRegister = false, extraData = {}) => {
    const {
      auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification
    } = await import("../firebase.js");
    let result;
    if (isRegister) {
      result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user).catch(() => {});
    } else {
      result = await signInWithEmailAndPassword(auth, email, password);
    }
    return _exchangeFirebaseToken(result.user, extraData);
  };

  const getDashboardRouteForRole = (role) => {
    switch (role) {
      case "student": return "/student/dashboard";
      case "industry": return "/industry/dashboard";
      case "academician": return "/academician/dashboard";
      case "institution": return "/institution/dashboard";
      case "admin": return "/admin/dashboard";
      default: return "/login";
    }
  };

  const value = {
    user, profile, token, loading,
    isAuthenticated: !!user && !!token,
    isEmailVerified: user?.emailVerified === true,
    accountStatus: user?.accountStatus || "active",
    role: user?.role || null,
    isStudent: user?.role === "student",
    isIndustry: user?.role === "industry",
    isAcademician: user?.role === "academician",
    isInstitution: user?.role === "institution",
    isAdmin: user?.role === "admin",
    // Core auth
    login, register, logout, verifyEmail, resendVerification, refreshUser,
    getDashboardRouteForRole,
    // Firebase OAuth
    loginWithGoogle, loginWithGithub, loginWithFirebase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
