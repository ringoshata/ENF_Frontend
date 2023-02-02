<template>
  <div>
    <dialog-form :dialogVisible="dialogVisible" :diaWidth="itemWidth" :title="title" @closeShow="closeShow"
      v-if="dialogVisible">
      <el-button type="primary" plain round v-for="item in audit" :key="item.name" @click="openGit(item.url)">{{
        item.name
      }}</el-button>
    </dialog-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DialogForm from "./DialogForm.vue";
export default {
  components: {
    DialogForm,
  },
  computed: {
    ...mapState(["IsPhone"]),
    itemWidth() {
      return this.IsPhone ? "90%" : "40%";
    },
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: "Audit Report",
      diaWidth: "40%",
      audit: [
        {
          name: "Medium risk USDC",
          url: "https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/smart-contract/SlowMist%20Audit%20Report%20-%20earning.farm_en-us.pdf",
        },
        {
          name: "ETH Leveraged Product",
          url: "https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/smart-contract/SlowMist%20Audit%20Report%20-%20Earning%20Farm%20-%20ETH%20Leverage_en-us.pdf",
        },
        {
          name: "Low risk USDC - V3",
          url: "https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/smart-contract/SlowMist%20Audit%20Report%20-%20EarningFarm%20v3%20Iterative_en-us.pdf",
        },
        {
          name: "Low risk ETH - V3",
          url: "https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/smart-contract/SlowMist%20Audit%20Report%20-%20ENF_ETH_Lowrisk_en-us.pdf"
        },
        {
          name: "Medium risk WBTC - V3",
          url: "https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/smart-contract/SlowMist%20Audit%20Report%20-%20ENF_WBTC_Borrow_ETH_en-us.pdf"
        }
      ],
    };
  },
  methods: {
    closeShow() {
      this.$emit("closeShow", false);
    },

    openGit(url) {
      let Win = window.open();
      Win.opener = null;
      Win.location = url;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-button {
  width: 100%;
  display: block;
  margin: 15px auto;
}
</style>
