<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
        <sidebar class="sidebar-container" />
        <div :class="{hasTagsView:needTagsView}" class="main-container">
            <div :class="{'fixed-header':fixedHeader}">
                <navbar />
                <tags-view v-if="needTagsView" />
            </div>
            <app-main />
        </div>
        <el-dialog title="修改密码" :visible.sync="pwdFormVisible" width="30%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="旧密码" prop="oldpwd">
                    <el-input v-model="ruleForm.oldpwd" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newpwd">
                    <el-input v-model="ruleForm.newpwd" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码" prop="checknewpass">
                    <el-input v-model="ruleForm.checknewpass" type="password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="updatePassword">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";

export default {
    name: "Layout",
    components: {
        Navbar,
        Sidebar,
        AppMain,
        TagsView
    },
    mixins: [ResizeMixin],
    computed: {
        ...mapState({
            sidebar: state => state.app.sidebar,
            device: state => state.app.device,
            showSettings: state => state.settings.showSettings,
            needTagsView: state => state.settings.tagsView,
            fixedHeader: state => state.settings.fixedHeader
        }),
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === "mobile"
            };
        },
        pwdFormVisible: {
            set(val) {
                this.$store.state.user.pwdFormVisible = val;
            },
            get() {
                return this.$store.state.user.pwdFormVisible;
            }
        }
    },
    data() {
        const validatePass = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.ruleForm.checknewpass !== "") {
                    this.$refs.ruleForm.validateField("checknewpass");
                }
                callback();
            }
        };

        const validatePass2 = (rule, value, callback) => {
            if (value == "" || !value) {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.newpwd) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {},
            rules: {
                oldpwd: [{ required: true, message: "请输入密码" }],
                newpwd: [
                    {
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur"
                    }
                ],
                checknewpass: [
                    {
                        required: true,
                        validator: validatePass2,
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch("app/closeSideBar", {
                withoutAnimation: false
            });
            this.$store.commit("user/SHOW_PWD_FORM", false);
        },
        updatePassword() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    console.log("Params", this.ruleForm);
                    updatePwd(this.ruleForm).then(() => {
                        this.$message({
                            title: "操作成功",
                            message: "修改密码成功",
                            type: "success",
                            duration: 2000
                        });
                        this.$store.commit("user/SHOW_PWD_FORM", false);
                    });
                } else {
                    return false;
                }
            });
        },
        dialogClose() {
            this.$store.commit("user/SHOW_PWD_FORM", false);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>
