import { DrawerNavigationProp } from "@react-navigation/drawer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";


// iocn props
export interface IconProps {
    width?: number | string;
    height?: number | string;
    fill?: string;
    color?: string;
    style?: any;
}


// naviagtion props
type DrawerNav = DrawerNavigationProp<any>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;
export type NavProps = DrawerNav & StackNav;

