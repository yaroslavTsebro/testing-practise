export class ValidationMessages {
  public static readonly VALUE_IS_TOO_LONG =
    ' must not be over this amount of characters: ';
  public static readonly VALUE_IS_TOO_SHORT =
    ' must not be less than this amount of characters: ';
  public static readonly VALUE_MUST_BE_STRING = ' must be string';
  public static readonly VALUE_MUST_BE_EMAIL = ' must be email';
  public static readonly EMAIL_MUST_BE_EMAIL =
    'Email' + ValidationMessages.VALUE_MUST_BE_EMAIL;
  public static readonly PASSWORD_IS_TOO_LONG =
    'Password' + ValidationMessages.VALUE_IS_TOO_LONG;
  public static readonly PASSWORD_IS_TOO_SHORT =
    'Password' + ValidationMessages.VALUE_IS_TOO_SHORT;
  public static readonly USERNAME_IS_TOO_LONG =
    'Username' + ValidationMessages.VALUE_IS_TOO_LONG;
  public static readonly USERNAME_IS_TOO_SHORT =
    'Username' + ValidationMessages.VALUE_IS_TOO_SHORT;
  public static readonly EMAIL_IS_TOO_LONG =
    'Email' + ValidationMessages.VALUE_IS_TOO_LONG;
  public static readonly EMAIL_IS_TOO_SHORT =
    'Email' + ValidationMessages.VALUE_IS_TOO_SHORT;
  public static readonly USERNAME_MUST_BE_STRING =
    'Username' + ValidationMessages.VALUE_MUST_BE_STRING;
  public static readonly EMAIL_MUST_BE_STRING =
    'Email' + ValidationMessages.VALUE_MUST_BE_STRING;
  public static readonly PASSWORD_MUST_BE_STRING =
    'Password' + ValidationMessages.VALUE_MUST_BE_STRING;
}