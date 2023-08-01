artifact_name       := accounts-filing-web
version             := "unversioned"

.PHONY: all
all: build

.PHONY: clean
clean:
	rm -f ./$(artifact_name)-*.zip
	rm -rf ./build-*
	rm -rf ./dist
	rm -f ./build.log

.PHONY: build
build:
	npm ci
	npm run build

.PHONY: lint
lint:
	npm run lint

.PHONY: sonar
sonar:
	echo "CODE_ANALYSIS_PULL_REQUEST_KEY = ${CODE_ANALYSIS_PULL_REQUEST_KEY}"
	cat sonar-project.properties
	npm run sonarqube

.PHONY: test
test:
	npm run coverage

.PHONY: package
package: build
ifndef version
	$(error No version given. Aborting)
endif
	$(info Packaging version: $(version))
	$(eval tmpdir := $(shell mktemp -d build-XXXXXXXXXX))
	cp -r ./dist/* $(tmpdir)
	cp -r ./package.json $(tmpdir)
	cp -r ./package-lock.json $(tmpdir)
	cp -r ./.git $(tmpdir)
	cp ./start.sh $(tmpdir)
	cp ./routes.yaml $(tmpdir)
	cd $(tmpdir) && export GIT_SSH_COMMAND="ssh" && npm ci --production
	rm $(tmpdir)/package.json $(tmpdir)/package-lock.json
	cd $(tmpdir) && zip -r ../$(artifact_name)-$(version).zip .
	rm -rf $(tmpdir)

.PHONY: dist
dist: lint test clean package