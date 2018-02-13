v1.0.0
-----

* **Breaking Change:** Will not configure or load the `anytv-i18n` module anymore.


v1.1.0
-----

* **New Feature:** `.template()` now supports absolute paths (ignores `TEMPLATES_DIR` config)


v1.2.0
-----

* **New Feature:** `.configure()` can now be used without `i18n`


v1.2.1
-----

* **Bug Fix:** Added _.toUpper on language key passed in derive_language method.


v1.2.2
-----

* **Bug Fix:** Prevent crashing when provided content has null value by using
lodash for checking types.
