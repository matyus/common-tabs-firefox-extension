.PHONY: init run deploy

init:
	brew install web-ext

dev:
	web-ext run

deploy:
	web-ext build
	web-ext sign --channel=unlisted --api-key=$(AMO_JWT_ISSUER) --api-secret=$(AMO_JWT_SECRET)
