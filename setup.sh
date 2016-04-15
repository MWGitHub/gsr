#!/usr/bin/env bash
bundle install
npm install
git config --local user.name mike
git config --local user.email mwwmail@gmail.com
bundle exec rails db:setup
bundle exec rails db:seed
apm install linter-eslint
apm enable linter-eslint
apm install pigments
apm enable pigments
apm install color-picker
apm enable color-picker
apm disable jshint
apm install react
apm enable react
apm install atom-ternjs
apm enable atom-ternjs
apm install docblockr
apm enable docblockr
