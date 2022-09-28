variable "ROLLUP_CONTRACT_ADDRESS" {
  type = string
}

output "rollup_contract_address" {
  value = "${var.ROLLUP_CONTRACT_ADDRESS}"
}

variable "PERMIT_HELPER_CONTRACT_ADDRESS" {
  type = string
}

output "permit_helper_contract_address" {
  value = "${var.PERMIT_HELPER_CONTRACT_ADDRESS}"
}

variable "FAUCET_CONTRACT_ADDRESS" {
  type = string
}

output "faucet_contract_address" {
  value = "${var.FAUCET_CONTRACT_ADDRESS}"
}

variable "FEE_DISTRIBUTOR_ADDRESS" {
  type = string
}

output "fee_distributor_address" {
  value = "${var.FEE_DISTRIBUTOR_ADDRESS}"
}

variable "PRICE_FEED_CONTRACT_ADDRESSES" {
  type = string
}

output "price_feed_contract_addresses" {
  value = "${var.PRICE_FEED_CONTRACT_ADDRESSES}"
}

variable "PUBLIC_ETHEREUM_HOST" {
  type = string
}

output "public_ethereum_host" {
  value = "${var.PUBLIC_ETHEREUM_HOST}"
}

variable "PRIVATE_ETHEREUM_HOST" {
  type = string
}

output "private_ethereum_host" {
  value = "${var.PRIVATE_ETHEREUM_HOST}"
}

variable "ETHEREUM_NETWORK" {
  type = string
}

output "ethereum_network" {
  value = "${var.ETHEREUM_NETWORK}"
}

variable "DEPLOY_TAG" {
  type = string
}

variable "INFURA_API_KEY" {
  type = string
}