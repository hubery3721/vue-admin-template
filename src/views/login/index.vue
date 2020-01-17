<template>
    <div class="login-container">
        <div class="login-headers">
            <img class="img" src="../../assets/images/YLZ_logo.png" />
            <span>统一支付平台</span>
        </div>
        <div class="login-main">
            <el-row>
                <el-col :span="12">
                    <img class="img" src="../../assets/images/login_thumb.png" />
                </el-col>
                <el-col :span="12">
                    <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
                        <div class="title-container">
                            <h3 class="title">用户登录</h3>
                        </div>
                        <el-form-item prop="username">
                            <span class="svg-container">
                                <svg-icon icon-class="user" />
                            </span>
                            <el-input ref="username" v-model="loginForm.username" placeholder="请输入登录账号" name="username" type="text" tabindex="1" auto-complete="on" />
                        </el-form-item>

                        <el-form-item prop="password">
                            <span class="svg-container">
                                <svg-icon icon-class="password" />
                            </span>
                            <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
                            <span class="show-pwd" @click="showPwd">
                                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                            </span>
                        </el-form-item>

                        <el-button :loading="loading" type="primary" size="medium" style="width:100%;" @click.native.prevent="handleLogin">登录</el-button>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
    name: "Login",
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error("请输入正确用户名"));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error("密码不能小于6位字符"));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username: "",
                password: ""
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateUsername
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validatePassword
                    }
                ]
            },
            loading: false,
            passwordType: "password",
            redirect: undefined
        };
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true
        }
    },
    methods: {
        showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "";
            } else {
                this.passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch("user/login", this.loginForm)
                        .then(() => {
                            this.$router.push({ path: this.redirect || "/" });
                            this.loading = false;
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$dark_gray: #333333;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $dark_gray;
            height: 47px;
            // caret-color: $cursor;

            &:-webkit-autofill {
                -webkit-text-fill-color: $dark_gray !important;
                transition: background-color 5000s ease-in-out 0s !important;
            }
        }
    }

    .el-form-item {
        background-color: #ffffff;
        border-radius: 2px;
        border: solid 1px #dcdee2;
    }
}
</style>

<style lang="scss" scoped>
$bg: #ffffff;
$dark_gray: #333333;
$light_gray: #eee;
$white: #ffffff;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    .login-headers {
        height: 50px;
        padding-left: 16px;
        background-color: #0090fa;
        position: fixed;
        left: 0;
        width: 100%;
        top: 0;
        z-index: 222;
        .img {
            float: left;
            margin-left: 16px;
            margin-top: 9px;
            height: 29px;
        }
        span {
            float: left;
            color: #ffffff;
            font-size: 24px;
            padding-left: 18px;
            line-height: 46px;
            font-weight: 400;
            font-family: "PangMenZhengDao";
        }
    }
    .login-main {
        width: 1000px;
        margin: 225px auto 0;
    }
    .login-form {
        position: relative;
        width: 370px;
        height: 336px;
        background-color: #ffffff;
        border-radius: 8px;
        border: solid 1px #d8d8d8;
        margin-left: 87px;
        padding: 35px;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 24px;
            color: $dark_gray;
            margin: 0px auto 40px auto;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
