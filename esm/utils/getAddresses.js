export function getAddresses(id) {
    const addresses = id === "1" ? mainnet : id === "31337" ? hardhat : arbitrum;
    return Object.assign({}, addresses);
}
const mainnet = {
    FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS: "0x835482FE0532f169024d5E9410199369aAD5C77E",
    FUSE_POOL_LENS_CONTRACT_ADDRESS: "0x6Dc585Ad66A10214Ef0502492B0CC02F0e836eec"
};
const arbitrum = {
    FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS: "0xc201b8c8dd22c779025e16f1825c90e1e6dd6a08",
    FUSE_POOL_LENS_CONTRACT_ADDRESS: "0xD6e194aF3d9674b62D1b30Ec676030C23961275e"
};
const hardhat = {
    FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS: "0xca8c8688914e0f7096c920146cd0ad85cd7ae8b9",
    FUSE_POOL_LENS_CONTRACT_ADDRESS: "0x976fcd02f7c4773dd89c309fbf55d5923b4c98a1"
};
//# sourceMappingURL=getAddresses.js.map