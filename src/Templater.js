'use strict';

import { EmailTemplate as Template } from 'email-templates';
import { Language } from './Language.js';
import country_language_map from './config/country_language_map.js';
import winston from 'winston';
import i18n from 'anytv-i18n';
import _ from 'lodash';



export default class Templater {

    constructor (config) {

        this.config = config;

        this._html = void 0;
        this._content = void 0;
        this._template = void 0;

        this._built = false;

        this._language = config.i18n.default;

        this._trans = this._trans.bind(this);
    }


    _trans (param) {

        return typeof param === 'object'
            ? i18n.trans(this._language, param.trans, param.data)
            : param;
    }


    language (lang) {
        this._language = lang || this._language;
        return this;
    }


    /**
     * gets the language code given 1 or more country or country code
     * returns the default language if not found
     *
     * @example:
     *      // where one of these countries can be null
     *      templater.derive_language(user_country, channel_country, signup_country)
     */
    derive_language (...keys) {

        const find = key =>
            language_group =>
                _.includes(language_group.countries, key)
                || language_group.countries[key];

        // used a native for loop to make the loop end
        // as soon as a match is found
        for (let i = 0; i < keys.length; i += 1) {

            const key = keys[i];

            const match = _.filter(country_language_map, find(key));

            if (match.length) {
                this._language = match[0].language;
                break;
            }
        }

        return this;
    }


    template (tpl) {
        this._template = tpl;
        return this;
    }

    content (_content) {
        this._content = _content;
        return this;
    }

    _render (next) {

        this._translate_content();

        // create Template object
        const template = new Template(this.config.templates_dir + this._template);

        template.render(this._content, (err, result) => {

            if (err) {
                return next('Error in rendering template: ' + JSON.stringify(err));
            }

            this._html = result.html;

            this._built = true;

            next(null, this._html);
        });

        return this;
    }


    _translate_content () {

        // process content
        if (this._content) {
            this._content = _.mapValues(this._content, this._trans);
        }

        return this;
    }


    build (next) {

        if (!this._template) {
            return next('Email does not have a template. Call .template() function');
        }

        if (this._built) {
            return next();
        }


        if (this._need_recommendation) {
            (new Language(this.config.database))
                .recommend_language(this._recommend_for)
                .then(this.language)
                .catch(() => {
                    winston.warn(
                        'Cannot find language to recommend.',
                        'Using: ', this._language
                    );
                })
                .then(this._render.bind(this, next));
        }
        else {
            this._render(next);
        }
    }

    recommend_language (identifier) {

        if (!_.has(this.config, 'database.ytfreedom')) {
            throw new Error('Missing ytfreedom database configuration');
        }

        if (!_.has(this.config, 'database.master')) {
            throw new Error('Missing master database configuration');
        }

        if (this._built) {
            throw new Error('Mail was already built. Doing nothing');
        }

        if (!this._to) {
            throw new Error('Recipients has not been set');
        }

        if (_.isArray(this._to) && this._to.length > 1) {
            return this.language(this.config.i18n.default);
        }

        this._need_recommendation = true;
        this._recommend_for = identifier || this._to;

        return this;
    }
}
