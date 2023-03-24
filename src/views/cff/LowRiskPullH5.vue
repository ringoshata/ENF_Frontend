<template>
    <div class="low-home">
        <ul v-for="(item, idx) in list" :key="idx" :class="{ 'ul-border': item.showContent }">
            <div class="title">
                <el-row>
                    <el-col :span="11">
                        <div class="title_text">
                            <img class="title_img" :src="require('../../assets/imgs/' + item.code + '.png')" alt />
                            <span>{{
                                item.code === "WBTC" ? "BTC/" + item.code : item.code
                            }}</span>
                        </div>
                    </el-col>


                    <el-col :span="2">
                        <div>
                            <el-divider direction="vertical"></el-divider>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <span style="font-size: 14px; color: #566570">
                            APY：{{ $numFixed(item.sevendayProfit, 1) + "%" }}</span>
                    </el-col>

                    <el-col :span="1">
                        <i :class="
                            item.showContent ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                        " style="cursor: pointer" @click="changeContent(item)"></i>
                    </el-col>
                </el-row>
            </div>

            <div v-if="item.showContent" class="bottom">
                <div class="body">
                    <el-row>
                        <el-col :span="6">
                            <div>
                                <li class="top_l3">
                                    <el-tooltip class="item" effect="dark" placement="top">
                                        <div slot="content">
                                            Asset: Calculated based on backend Defi Protocols. <br />
                                            May have difference when withdrawing due to big slippage.
                                            <br />
                                            Accu Yield: Unrealized earnings in the backend protocols.
                                        </div>
                                        <span> Personal</span>
                                    </el-tooltip>
                                </li>
                                <li class="top_li">Asset</li>
                                <li class="bom_li">
                                    {{ $nameFixed(item.user_assets, item.code) }}
                                </li>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="6">
                            <div>
                                <li class="top_l3">
                                    <el-tooltip class="item" effect="dark" placement="top">
                                        <div slot="content">
                                            30 Days APY: Calculated by the past 30 days daily APR in
                                            average.
                                        </div>
                                        <span>Protocol</span>
                                    </el-tooltip>
                                </li>

                                <li class="top_li">Asset</li>
                                <li class="bom_li">
                                    {{ $nameFixed(item.total, item.code) }}
                                </li>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="body_text">
                    <div>
                        <el-button type="primary" plain  @click="approve" class="crbtn"
                            :disabled="item.isApproved">Approve
                        </el-button>
                        
                    </div>
                    <div>
                        <el-button type="primary" plain  @click="claim(item)" class="crbtn"
                            :disabled="item.isClaimed || item.user_assets == 0">
                            Claim</el-button>
                    </div>
                </div>
            </div>
        </ul>

        <dialog-form :dialogVisible="dialogVisible" :diaWidth="diaWidth" :title="title" @closeMain="closeMain"
            v-if="dialogVisible">
            <component :is="currentName" :echartsData="echartsData" :codeurl="codeurl" :maximize="maximize"
                :eHeight="'400px'" :code="itemData.code" />
        </dialog-form>

        <dialog-form :dialogVisible="dialogVisible" :diaWidth="diaWidth" :title="title" @closeMain="closeMain"
            v-if="dialogVisible">
            <component :is="currentName" :maximize="maximize" :echartsData="echartsData" :codeurl="codeurl"
                :eHeight="'400px'" :code="itemData.code" />
        </dialog-form>

        <dialog-form :dialogVisible="isCalc" diaWidth="70%" @closeMain="closeisisCalc" v-if="isCalc">
            <div>
                The slippage between usdc and alusd is {{ Number(calcNum) + 1 }}, we
                recommend you postpone withdraw until the rate is near！
            </div>
            <button class="yieldbtn" @click="withdraw(itemData, 1)">Confirm</button>
        </dialog-form>
    </div>
</template>
  
<script>
import EchartsLine from "./EchartsLine.vue";
import CffTableNew from "./CffTableNew.vue";
import DialogForm from "../../components/DialogForm.vue";
import LowRiskMixinUSDC from "../../components/mixins/LowRiskMixinUSDC";
export default {
    name: "LowRiskPullH5",
    mixins: [LowRiskMixinUSDC],
    components: {
        DialogForm,
        EchartsLine,
        CffTableNew,
    },
    computed: {
        currentName() {
            switch (this.dialogName) {
                case "EchartsLine":
                    return EchartsLine;
                case "CffTableNew":
                    return CffTableNew;
                default:
                    return "";
            }
        },
    },
};
</script>

<style scoped lang="scss">

.crbtn {
  border-radius: 36px;
  margin-bottom: 10px;
}

.low-home {
    ul {
        border-radius: 22px;
        border: 1px solid #aab1b7;
        padding-inline-start: 0;
        background-color: #fff;
        margin-bottom: 10px;

        li {
            list-style-type: none;
            padding: 5px 0;
        }
    }

    ul:hover {
        border-color: #2196f3;
        box-shadow: 0px 0px 8px rgba(25, 118, 210, 0.23);
    }

    .ul-border {
        border-color: #2196f3;
        box-shadow: 0px 0px 8px rgba(25, 118, 210, 0.23);
    }

    .title {
        padding: 10px 14px;

        .el-row {
            padding: 10px 0;
            display: flex;
            align-items: center;

            .el-divider--vertical {
                height: 52px;
            }

            // .el-col {
            //   padding: 0 10px;
            // }
            li {
                white-space: normal;
                word-break: break-all;
                word-wrap: break-word;
            }
        }
    }

    .title_img {
        width: 20%;
    }

    .title_text {
        display: flex;
        align-items: center;

        span {
            padding-left: 5px;
            font-size: 18px;
            color: #566570;
            font-weight: 500;
        }
    }

    .top_li {
        font-size: 14px;
        color: rgba(147, 156, 163, 1);
    }

    .top_l3 {
        font-size: 14px;
        height: 25px;
        color: #566570;

        span {
            cursor: help;
        }
    }

    .top_l2 {
        font-size: 14px;
        height: 25px;
        color: #fff;
    }

    .bom_tu {
        // float: right;

        margin-right: 20px;
        font-size: 14px;
        color: #2196f3;
        border-bottom: 1px solid;
        cursor: pointer;
    }

    .bom_li {
        font-size: 14px;
        color: #566570;

        .showWbtc {
            float: right;
            font-size: 14px;
            color: #409eff;
            border-bottom: 1px solid #409eff;
            cursor: pointer;
        }
    }

    .bottom {
        padding-left: 30px;
        background: #f4f9fd;
        border-radius: 0 0 22px 22px;
    }

    .body {
        padding: 20px 0;

        .el-row {
            margin-bottom: 12px;
        }

        .el-button {
            border-radius: 30px;
        }

        .linetable {
            margin-top: 12px;
        }

        .spanText {
            font-size: 14px;
            color: #939ca3;
            margin-bottom: 14px;
        }
    }

    .el-button {
        width: 90%;
        font-size: 14px;
    }

    .body_text {
        .el-row {
            padding: 10px 0;
            display: flex;
            align-items: center;
        }

        .el-button {
            border-radius: 30px;
        }

        .btcwbtc {
            text-align: end;
            margin-right: 30px;
            padding-bottom: 10px;

            .ratio {
                color: #ffa267;
            }
        }

        .maxinput {
            margin-right: 30px;
            padding-bottom: 20px;

            .el-slider {
                width: 95%;
                margin: 0 auto;
            }
        }
    }

    .input_span {
        float: right;
        font-size: 14px;
        color: #566570;
        // cursor: pointer;
        margin-bottom: 5px;
    }

    .Max {
        background-color: #ffa267;
        border-radius: 50px;
        padding: 0 10px;
        color: #fff;
        cursor: pointer;
    }

    /deep/ .el-input-group__append {
        background-color: rgba(244, 249, 253, 1) !important;
        border: none !important;
        border-radius: 36px;
    }

    /deep/ .el-input__inner {
        border: none !important;
        background-color: rgba(244, 249, 253, 1) !important;
        border-radius: 36px;
    }

    /deep/ .el-slider__button-wrapper {
        z-index: 0 !important;
    }

    .input_li {
        // border: 1px solid rgba(204, 208, 211, 1);
        // border-radius: 36px;
        padding: 0;
        margin: 5px 0;
    }

    .el-input {
        border: 1px solid rgba(204, 208, 211, 1);
        border-radius: 36px;
    }

    // /deep/ .el-input:focus-within {
    //   border: 1px solid rgba(33, 150, 243, 1);
    //   border-radius: 36px;
    // }
    .el-input:hover {
        border: 1px solid rgba(33, 150, 243, 1);
        border-radius: 36px;
    }

    .el-input:active {
        border: 1px solid rgba(33, 150, 243, 1);
        border-radius: 36px;
    }

    /deep/ .el-slider__button {
        width: 10px;
        height: 10px;
    }

    .el-col-10 {
        position: relative;
    }

    .ratio {
        font-size: 14px;
        color: #ffa267;

        span {
            margin-right: 15px;
        }
    }
}
</style>
  