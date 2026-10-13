COMPOSE = docker compose
APP = $(COMPOSE) exec app
MYSQL = $(COMPOSE) exec -T mysql
EXPORT = database/exports/menusass.sql

.PHONY: up down build rebuild logs sh install key migrate fresh seed test npm dev build-assets db-export db-import

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) build --no-cache

logs:
	$(COMPOSE) logs -f app

sh:
	$(COMPOSE) exec app bash

install:
	$(APP) composer install
	$(APP) npm install

key:
	$(APP) php artisan key:generate

migrate:
	$(APP) php artisan migrate

fresh:
	$(APP) php artisan migrate:fresh --seed

seed:
	$(APP) php artisan db:seed

test:
	$(APP) php artisan test

npm:
	$(APP) npm $(ARGS)

dev:
	$(COMPOSE) up node

build-assets:
	$(APP) npm run build

db-export:
	mkdir -p database/exports
	$(MYSQL) mysqldump -uroot -prootsecret --databases menusass --single-transaction --routines --triggers --no-tablespaces > $(EXPORT)
	@echo "Exported to $(EXPORT)"

db-import:
	$(MYSQL) mysql -uroot -prootsecret menusass < $(FILE)
