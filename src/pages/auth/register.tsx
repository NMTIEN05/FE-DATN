import React from "react";
import { Link } from "react-router-dom";
import styles from "./AuthForm.module.css"; // Dùng lại CSS

const Register = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.background}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
            </div>
            <form className={styles.form}>
                <h3>Register</h3>

                <label htmlFor="username">Tên đăng nhập*</label>
                <input
                    type="text"
                    placeholder="Username"
                    id="username"
                    required
                />

                <label htmlFor="email">Email*</label>
                <input type="email" placeholder="Email" id="email" required />

                <label htmlFor="full_name">Họ và tên*</label>
                <input
                    type="text"
                    placeholder="Enter your full name"
                    id="full_name"
                    required
                />

                <label htmlFor="password">Mật khẩu*</label>
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    required
                />

                <button type="submit">Đăng ký</button>

                <div className={styles.social}>
                    <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;

// register
