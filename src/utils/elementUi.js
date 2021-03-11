import {
  Loading,
  Menu,
  MenuItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Input,
  Button,
  Carousel,
  CarouselItem,
  Tabs,
  TabPane,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Card,
  Dialog,
  Form,
  FormItem,
  Upload,
  Popover,
  Avatar,
  Pagination,
  Select,
  Option,
  Table,
  Tooltip,
  TableColumn,
  Message
} from 'element-ui'

const element = {
  install(Vue) {
    Vue.use(Loading)
    Vue.use(Menu)
    Vue.use(MenuItem)
    Vue.use(Dropdown)
    Vue.use(DropdownItem)
    Vue.use(DropdownMenu)
    Vue.use(Input)
    Vue.use(Button)
    Vue.use(CarouselItem)
    Vue.use(Carousel)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(Avatar)
    Vue.use(Breadcrumb)
    Vue.use(BreadcrumbItem)
    Vue.use(Row)
    Vue.use(Card)
    Vue.use(Dialog)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Upload)
    Vue.use(Popover)
    Vue.use(Pagination)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Tooltip)
    Vue.prototype.$message = Message
  }
}

export default element
