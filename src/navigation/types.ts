export type RootTabParamList = {
  Today: undefined;
  Performance: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
} 