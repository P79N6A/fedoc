import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'bisheng/router';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Select, Menu, Row, Col, Icon, Popover, Input, Button } from 'antd';
import Santa from './Santa';
import * as utils from '../utils';
import { version as antdVersion } from '../../../../package.json';

const { Option } = Select;
const index = '/docs/community/introduce'
let docsearch;
if (typeof window !== 'undefined') {
  docsearch = require('docsearch.js'); // eslint-disable-line
}

function initDocSearch(locale) {
  if (!docsearch) {
    return;
  }
  const lang = locale === 'zh-CN' ? 'cn' : 'en';
  docsearch({
    apiKey: '60ac2c1a7d26ab713757e4a081e133d0',
    indexName: 'ant_design',
    inputSelector: '#search-box input',
    algoliaOptions: { facetFilters: [`tags:${lang}`] },
    transformData(hits) {
      hits.forEach(hit => {
        hit.url = hit.url.replace('ant.design', window.location.host); // eslint-disable-line
        hit.url = hit.url.replace('https:', window.location.protocol); // eslint-disable-line
      });
      return hits;
    },
    debug: false, // Set debug to true if you want to inspect the dropdown
  });
}

export default class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  state = {
    menuVisible: false,
  };

  componentDidMount() {
    const { intl, router } = this.context;
    router.listen(this.handleHideMenu);
    const { searchInput } = this;
    document.addEventListener('keyup', event => {
      if (event.keyCode === 83 && event.target === document.body) {
        searchInput.focus();
      }
    });
    initDocSearch(intl.locale);
  }

  handleShowMenu = () => {
    this.setState({
      menuVisible: true,
    });
  };

  handleHideMenu = () => {
    this.setState({
      menuVisible: false,
    });
  };

  onMenuVisibleChange = visible => {
    this.setState({
      menuVisible: visible,
    });
  };

  handleVersionChange = url => {
    const currentUrl = window.location.href;
    const currentPathname = window.location.pathname;
    window.location.href = currentUrl
      .replace(window.location.origin, url)
      .replace(currentPathname, utils.getLocalizedPathname(currentPathname));
  };

  handleLangChange = () => {
    // window.location.href = 'https://shudong.wang'
    const {
      location: { pathname },
    } = this.props;
    const currentProtocol = `${window.location.protocol}//`;
    const currentHref = window.location.href.substr(currentProtocol.length);

    if (utils.isLocalStorageNameSupported()) {
      localStorage.setItem('locale', utils.isZhCN(pathname) ? 'en-US' : 'zh-CN');
    }

    window.location.href =
      currentProtocol +
      currentHref.replace(
        window.location.pathname,
        utils.getLocalizedPathname(pathname, !utils.isZhCN(pathname)),
      );
  };

  shudong = () =>{
    window.location.href = 'https://shudong.wang'
  }

  render() {
    const { menuVisible } = this.state;
    const { isMobile } = this.context;
    const menuMode = isMobile ? 'inline' : 'horizontal';
    const { location, themeConfig } = this.props;
    const docVersions = { ...themeConfig.docVersions, [antdVersion]: antdVersion };
    const versionOptions = Object.keys(docVersions).map(version => (
      <Option value={docVersions[version]} key={version}>
        {version}
      </Option>
    ));
    const module = location.pathname
      .replace(/(^\/|\/$)/g, '')
      .split('/')
      .slice(0, -1)
      .join('/');
    let activeMenuItem = module || 'home';
    if (activeMenuItem === 'components' || location.pathname === 'changelog') {
      activeMenuItem = 'docs/react';
    }
    const {
      intl: { locale },
    } = this.context;
    const isZhCN = locale === 'zh-CN';

    const headerClassName = classNames({
      clearfix: true,
    });

    const menu = [
      <Button
        ghost
        size="small"
        onClick={this.shudong}
        className="header-lang-button"
        key="lang-button"
      >
        <FormattedMessage id="app.header.fecx" />
      </Button>,
      // <Select
      //   key="version"
      //   className="version"
      //   size="small"
      //   dropdownMatchSelectWidth={false}
      //   defaultValue={antdVersion}
      //   onChange={this.handleVersionChange}
      //   getPopupContainer={trigger => trigger.parentNode}
      // >
      //   {versionOptions}
      // </Select>,
      <Menu
        className="menu-site"
        mode={menuMode}
        selectedKeys={[activeMenuItem]}
        id="nav"
        key="nav"
      >
        <Menu.Item key="home" className="hide-in-home-page">
          <Link to={utils.getLocalizedPathname('/docs/community/introduce', isZhCN)}>
            <FormattedMessage id="app.header.menu.home" />
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/community">
          <Link to={utils.getLocalizedPathname('/docs/community/introduce', isZhCN)}>
            <FormattedMessage id="app.header.menu.community" />
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/xcx">
          <Link to={utils.getLocalizedPathname('/docs/xcx/introduce', isZhCN)}>
            <FormattedMessage id="app.header.menu.xcx" />
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/wechat">
          <Link to={utils.getLocalizedPathname('/docs/wechat/introduce', isZhCN)}>
            <FormattedMessage id="app.header.menu.wechat" />
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/shortcuts">
          <Link to={utils.getLocalizedPathname('/docs/shortcuts/introduce', isZhCN)}>
            <FormattedMessage id="app.header.menu.shortcuts" />
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/mac">
          <Link to={utils.getLocalizedPathname('/docs/mac/introduce', isZhCN)}>
            <FormattedMessage id="app.header.menu.mac" />
          </Link>
        </Menu.Item>
      </Menu>,
    ];

    const searchPlaceholder = locale === 'zh-CN' ? '在 fe.cx 中搜索' : 'Search in fe.cx';
    return (
      <header id="header" className={headerClassName}>
        {isMobile && (
          <Popover
            overlayClassName="popover-menu"
            placement="bottomRight"
            content={menu}
            trigger="click"
            visible={menuVisible}
            arrowPointAtCenter
            onVisibleChange={this.onMenuVisibleChange}
          >
            <Icon className="nav-phone-icon" type="menu" onClick={this.handleShowMenu} />
          </Popover>
        )}
        <Row>
          <Col xxl={4} xl={5} lg={5} md={5} sm={24} xs={24}>
            <Link to={utils.getLocalizedPathname(index, isZhCN)} id="logo">
              前端内参
              <Santa />
            </Link>
          </Col>
          <Col xxl={20} xl={19} lg={19} md={19} sm={0} xs={0}>
            <div id="search-box">
              <Icon type="search" />
              <Input
                ref={ref => {
                  this.searchInput = ref;
                }}
                placeholder={searchPlaceholder}
              />
            </div>
            {!isMobile && menu}
          </Col>
        </Row>
      </header>
    );
  }
}
