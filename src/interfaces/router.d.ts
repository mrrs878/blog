interface RouteConfigI {
  path: string;
  component: any;
  title: string;
  exact?: boolean;
  auth?: boolean;
}
