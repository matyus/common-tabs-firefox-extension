.PHONY: init run build

init:
	brew install web-ext

dev:
	web-ext run

sign:
	web-ext sign --channel=unlisted --api-key=$(AMO_JWT_ISSUER) --api-secret=$(AMO_JWT_SECRET)
