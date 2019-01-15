#### 修改默认编译中文 md
```
  constructor(props) {
    super(props);
    // const { pathname } = props.location;
    // const appLocale = utils.isZhCN(pathname) ? cnLocale : enLocale;
    const appLocale = cnLocale;
    addLocaleData(appLocale.data);

    this.state = {
      appLocale,
      isMobile,
    };
  }
```
