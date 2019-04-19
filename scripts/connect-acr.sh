#!/bin/bash
set -eou pipefail

# NOTE: this script should be ran from the root of the repository; the CWD should reflect this
REGISTRY=upskillBedrockRegistry
VERSION=latest
CONTAINER_NAME=vott-container
AZURE_SUB_NAME="PELITTLE TEAM - CSE DWR"
AZURE_SUB_ID=d36d0808-a967-4f73-9fdc-32ea232fc81d

echo "registry=${REGISTRY}"
echo "versio=${VERSION}"
echo "container=${CONTAINER}"
echo "azure_sub_name=${AZURE_SUB_NAME}"
echo "azure_sub_id=${AZURE_SUB_ID}"

echo "Setting Azure subscription to: ${AZURE_SUB_NAME}"
az account set --subscription ${AZURE_SUB_ID}

echo "Logging into ACR ${REGISTRY}"
az acr login --name ${REGISTRY}
