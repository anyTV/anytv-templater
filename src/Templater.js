

import _ from 'lodash';
import winston from 'winston';
import { EmailTemplate as Template } from 'email-templates';

import { Language } from './Language';
import country_language_map from './config/country_language_map';


export default class Templater {

    constructor(config) {

        this.config = config;

        this._html = void 0;
        this._content = void 0;
        this._template = void 0;

        this._built = false;

        this._mapper = config.mapper || config.i18n || this._mapper();

        this._trans = this._trans.bind(this);
    }


    _mapper() {
        return {
            trans(lang, key, variables) {

                if (_.isUndefined(variables)) {

                    // support for trans(key, variable)
                    if (_.isPlainObject(key)) {
                        variables = key;
                        key = lang;
                    }

                    // support for trans(key)
                    else if (_.isUndefined(key)) {
                        key = lang;
                    }

                    // support for trans(lang, key)
                    else {
                        variables = {};
                    }
                }


                let str = key;

                /**
                 * Replace variables in the string
                 * `Hello :name!` => `Hello John!`
                 * `:name aloha!` => `John aloha!`
                 */
                _(variables).forOwn((value, _key) => {
                    str = str.replace(new RegExp(`:${_key}\b`, 'g'), value);
                });

                return str;
            }
        };
    }


    _trans(param) {

        return _.isPlainObject(param)
            ? this._mapper.trans(this._language, param.trans, param.data)
            : param;
    }


    language(lang) {
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
    derive_language(...keys) {

        const find = key => {

            const country_code = _.upperCase(key);
            const country_name = _.startCase(_.lowerCase(key));

            return language_group =>
                _.includes(language_group.countries, country_name)
                || language_group.countries[country_code];
        };
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


    template(tpl) {
        this._template = tpl;

        return this;
    }

    content(_content) {
        this._content = _content;

        return this;
    }

    _render(next) {

        this._translate_content();

        const template_path = this._template[0] !== '/'
            ? this.config.templates_dir + this._template
            : this._template;

        // create Template object
        const template = new Template(template_path);

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


    _translate_content() {

        // process content
        if (this._content) {
            this._content = _.mapValues(this._content, this._trans);
        }

        return this;
    }


    build(next) {

        if (!this._template) {
            next('Email does not have a template. Call .template() function');

            return this;
        }

        if (this._built) {
            next(null, this._html);

            return this;
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

        return this;
    }

    recommend_language(identifier) {

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
            return this.language(this.config.i18n.config.get('default'));
        }

        this._need_recommendation = true;
        this._recommend_for = identifier || this._to;

        return this;
    }
}
