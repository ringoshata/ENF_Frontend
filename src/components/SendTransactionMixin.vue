<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["Pendings", "MetaMaskAddress"]),
  },
  methods: {
    sendTransaction(params, callback = () => {}) {
      this.$web3.eth
        .sendTransaction(params)
        .on("transactionHash", (hash) => {
          const obj = {
            id: this.MetaMaskAddress,
            hash: hash,
            time: new Date().getTime(),
            params,
            callback,
            // type: type
          };
          this.Pendings.push(obj);
          this.withdrawInput = 0;
          this.withdrawVal = 0;
          this.confirmInput = 0;
          this.confirmVal = 0;
          this.maxWithdraw = false;
        })
        .on("error", (err) => {
          console.log(err);
        });
    },
  },
};
</script>
