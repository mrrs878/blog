interface UserI {
  name: string;
  _id: string;
  role: number;
  token: string;
}

interface MenuItemI {
  key: string;
  icon?: Object;
  icon_name?: string;
  title: string;
  path: string;
  children?: Array<MenuItemI>;
  sub_menu: Array<string>;
  parent: string;
  role?: Array<number>;
  status: number;
}

interface DictI {
  id?: number;
  status: number;
  create_time: number;
  label: string;
  label_view: string;
  type: string;
  type_view: string;
  name: string;
  value: number;
}

interface AjaxErrorI extends Error{
  date: number;
  data: any;
  url: string;
  referer: string;
  method: string;
  status: number;
}

interface CommonErrorI extends Error{
  date: number;
}

interface DashboardDataI {
  group: string;
  label: string;
  key: string;
  value: number;
}

interface ContentI {
  title: string;
  level: number;
  key: string;
  children: Array<ContentI>;
}

interface ArticleSubI {
  _id?: string;
  title: string;
  description?: string;
  categories: string;
  tag: string;
  createTime: string;
  updateTime?: string;
  watch?: number;
  author: string;
}

interface GithubCommitI {
  commit: {
    committer: {
      name: string;
      email: string;
      date: string;
    }
  }
}

interface CommentI {
  name: string;
  content: string;
  user_id: string;
  article_id: string;
  _id: string;
  createTime: string;
  avatar?: string;
}
