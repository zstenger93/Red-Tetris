run:
	cd red_tetris/src/server && npm install && npm start &
	cd red_tetris/src/client && npm install && npm start



install:
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
	source ~/.nvm/nvm.sh
	nvm install node
	npm install
