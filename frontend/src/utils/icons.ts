import { createFromIconfontCN } from "@ant-design/icons"

const IconJSUrl = "//at.alicdn.com/t/font_2081653_tike976ogy.js"

const MyIcon = createFromIconfontCN({
  scriptUrl: IconJSUrl,
  extraCommonProps: {
    className: "text-2xl",
  },
})

export enum IconType {
  PUPPET_WEB = "icon-Web",
  PUPPET_MOBILE = "icon-mobile",
  PUPPET_PAD = "icon-pad",
  PUPPET_MAC = "icon-mac",
  DOT_CONNECTED = "icon-dot-connected",
  GENDER_FEMALE = "icon-gender-female",
  GENDER_MALE = "icon-gender-male",
  RIGHT = "icon-right",
  WRONG = "icon-wrong",
  COFFEE = "icon-coffee",
  SUBMIT = "icon-submit",
  WARNING = "icon-warning",
}

export default MyIcon
