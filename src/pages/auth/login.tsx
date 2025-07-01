import React from "react";
import { Link } from "react-router-dom";
import styles from "./AuthForm.module.css"; // Dùng lại CSS

const Login = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.background}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
            </div>
            <form className={styles.form}>
                <h3>Login</h3>

                <label>Email</label>
                <input type="text" placeholder="Email" id="email" />

                <label>Password</label>
                <input type="password" placeholder="Password" id="password" />

                <button>Đăng nhập</button>

                <div className={styles.social}>
                    <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;

// login
