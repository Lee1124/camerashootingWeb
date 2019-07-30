import homePage from '@/components/homePage/homePage';
import Calender from '@/components/calendar/calendar';
import deviceHome from '@/components/device/deviceHome';
import deviceList from '@/components/device/pages/deviceList';
import maintainView from '@/components/device/pages/maintainView';
import outgoingList from '@/components/device/pages/outgoingList';
import statisticalView from '@/components/device/pages/statisticalView';
import orderManage from '@/components/orderManage/orderManage';
import orderManageOurShop from '@/components/orderManage/pages/orderManage-ourShop';
import setting from '@/components/setting/settingHome';
import personal from "@/components/setting/personal";
import userManage from "@/components/setting/userManage";
import departManage from "@/components/setting/departManage";
import postManage from "@/components/setting/postManage";
import hotelManage from "@/components/setting/hotelManage";
import weddingManage from "@/components/setting/weddingManage";
import projectManage from "@/components/setting/projectManage";
import checkSetting from "@/components/setting/checkSetting";
import otherSetting from "@/components/setting/otherSetting";
import companySetting from "@/components/setting/companyInfoSetting";

export default [
  {
    path: '/homePage',
    name: 'homePage',
    component: homePage,
    redirect: '/homePage/Calender',
    children: [
      {
        path: 'Calender',
        name: 'Calender',
        component: Calender,
      },
      {
        path: '/deviceHome',
        name: 'deviceHome',
        component: deviceHome,
        redirect: '/deviceHome/device',
        children: [
          {
            path: 'device',
            component: deviceList,
          },
          {
            path: 'outgoing',
            component: outgoingList,
          },
          {
            path: 'maintain',
            component: maintainView,
          },
          {
            path: 'statistical',
            component: statisticalView,
          }
        ]
      },
      {
        path: '/caiwu',
        name: 'caiwu',
        component: resolve => require(['@/components/caiwu/caiwu'], resolve)
      },
      {
        path: '/settingHome',
        name: 'settingHome',
        component: setting,
        redirect: '/settingHome/personal',
        children: [
          {
            path: 'personal',
            component: personal,
          },
          {
            path: 'user',
            component: userManage,
          },
          {
            path: 'depart',
            component: departManage,
          },
          {
            path: 'hotel',
            component: hotelManage,
          },
          {
            path: 'wedding',
            component: weddingManage,
          },
          {
            path: 'project',
            component: projectManage,
          },
          {
            path: 'post',
            component: postManage,
          },
          {
            path: 'check',
            component: checkSetting,
          },
          {
            path: 'other',
            component: otherSetting,
          },
          {
            path: 'company',
            component: companySetting,
          }
        ]
      },
      {
        path: '/orderManage',
        name: 'orderManage',
        component: orderManage,
        redirect: '/orderManage/orderManageOurShop',
        children: [
          {//本店订单
            path: 'orderManageOurShop',
            component: orderManageOurShop,
          },
          {//待回馈订单
            path: 'orderManageWillRepayOrder',
            component: () =>
              import('@/components/orderManage/pages/orderManage-ourShop'),
          },
          {//拍摄待交接
            path: 'orderManageShotWillHandover',
            component: () =>
              import('@/components/orderManage/pages/orderManage-ourShop'),
          },
          {//待安排拍摄
            path: 'orderManageWillShot',
            component: () =>
              import('@/components/orderManage/pages/orderManage-ourShop'),
          },
          {//待安排后期
            path: 'orderManageWillHQ',
            component: () =>
              import('@/components/orderManage/pages/orderManage-ourShop'),
          },
          {//待后期制作
            path: 'orderManageHQMake',
            component: () =>
              import('@/components/orderManage/pages/orderManage-ourShop'),
          },
          {//待审核
            path: 'orderManageWillPass',
            component: () =>
              import('@/components/orderManage/pages/orderManage-ourShop'),
          },
          {//退回
            path: 'orderManageReturn',
            component: () =>
              import('@/components/orderManage/pages/orderManage-ourShop'),
          },
          {//待交接客户
            path: 'orderManageWillTransferKH',
            component: () =>
              import('@/components/orderManage/pages/orderManage-ourShop'),
          },
          {//订单完成
            path: 'orderManageOrderSuccess',
            component: () =>
              import('@/components/orderManage/pages/orderManage-ourShop'),
          },
        ]
      }
    ]
  }
]
