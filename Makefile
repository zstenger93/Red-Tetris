
install:
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
	source ~/.nvm/nvm.sh
	nvm install node
	npm install

npml:
	cd app && npm install --legacy-peer-deps

run:
	cd app && npm run serve
