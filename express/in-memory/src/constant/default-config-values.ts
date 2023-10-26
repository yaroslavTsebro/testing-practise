export class DefaultConfigValues {
  public static readonly DB_HOST = 'host.docker.internal';
  public static readonly DB_NAME = 'mydb';
  public static readonly DB_USER = 'user';
  public static readonly DB_PASSWORD = 'password';
  public static readonly DB_TYPE = 'mongodb';
  public static readonly DB_PORT = 27017;
  public static readonly APP_PORT = 5000;

  public static readonly ACCESS_SECRET = 'geferfefefefreerf';
  public static readonly REFRESH_SECRET = 'ferferfrfere';
  public static readonly REFRESH_EXP = '30d';
  public static readonly REFRESH_COOKIE_EXP = 60 * 5 * 5;
  public static readonly ACCESS_EXP = '20m';
}