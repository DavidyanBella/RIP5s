/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Artwork {
  /** ID */
  id?: number;
  /** Owner */
  owner?: string;
  /** Moderator */
  moderator?: string;
  /** Characters */
  characters?: string;
  /** Статус */
  status?: 1 | 2 | 3 | 4 | 5;
  /**
   * Дата создания
   * @format date-time
   */
  date_created?: string | null;
  /**
   * Дата формирования
   * @format date-time
   */
  date_formation?: string | null;
  /**
   * Дата завершения
   * @format date-time
   */
  date_complete?: string | null;
  /** Field */
  field?: string | null;
  /**
   * Count
   * @min -2147483648
   * @max 2147483647
   */
  count?: number | null;
}

export interface CharacterArtwork {
  /** ID */
  id?: number;
  /**
   * Comment
   * @min -2147483648
   * @max 2147483647
   */
  comment?: number;
  /** Character */
  character?: number | null;
  /** Artwork */
  artwork?: number | null;
}

export interface UpdateArtworkStatusAdmin {
  /** Status */
  status: number;
}

export interface CharacterAdd {
  /**
   * Название
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * Описание
   * @minLength 1
   * @maxLength 500
   */
  description: string;
  /**
   * Категория
   * @min -2147483648
   * @max 2147483647
   */
  category: number;
  /**
   * Фото
   * @format uri
   */
  image?: string | null;
}

export interface Character {
  /** ID */
  id?: number;
  /** Image */
  image?: string;
  /**
   * Название
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * Описание
   * @minLength 1
   * @maxLength 500
   */
  description: string;
  /** Статус */
  status?: 1 | 2;
  /**
   * Категория
   * @min -2147483648
   * @max 2147483647
   */
  category: number;
}

export interface UserLogin {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface UserRegister {
  /** ID */
  id?: number;
  /**
   * Адрес электронной почты
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export interface UserProfile {
  /**
   * Username
   * @minLength 1
   */
  username?: string;
  /**
   * Email
   * @minLength 1
   */
  email?: string;
  /**
   * Password
   * @minLength 1
   */
  password?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  artworks = {
    /**
     * No description
     *
     * @tags artworks
     * @name ArtworksList
     * @request GET:/artworks/
     * @secure
     */
    artworksList: (
      query?: {
        status?: number;
        date_formation_start?: string;
        date_formation_end?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/artworks/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags artworks
     * @name ArtworksRead
     * @request GET:/artworks/{artwork_id}/
     * @secure
     */
    artworksRead: (artworkId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/artworks/${artworkId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags artworks
     * @name ArtworksDeleteDelete
     * @request DELETE:/artworks/{artwork_id}/delete/
     * @secure
     */
    artworksDeleteDelete: (artworkId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/artworks/${artworkId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags artworks
     * @name ArtworksDeleteCharacterDelete
     * @request DELETE:/artworks/{artwork_id}/delete_character/{character_id}/
     * @secure
     */
    artworksDeleteCharacterDelete: (artworkId: string, characterId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/artworks/${artworkId}/delete_character/${characterId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags artworks
     * @name ArtworksUpdateUpdate
     * @request PUT:/artworks/{artwork_id}/update/
     * @secure
     */
    artworksUpdateUpdate: (artworkId: string, data: Artwork, params: RequestParams = {}) =>
      this.request<Artwork, any>({
        path: `/artworks/${artworkId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags artworks
     * @name ArtworksUpdateCharacterUpdate
     * @request PUT:/artworks/{artwork_id}/update_character/{character_id}/
     * @secure
     */
    artworksUpdateCharacterUpdate: (
      artworkId: string,
      characterId: string,
      data: CharacterArtwork,
      params: RequestParams = {},
    ) =>
      this.request<CharacterArtwork, any>({
        path: `/artworks/${artworkId}/update_character/${characterId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags artworks
     * @name ArtworksUpdateStatusAdminUpdate
     * @request PUT:/artworks/{artwork_id}/update_status_admin/
     * @secure
     */
    artworksUpdateStatusAdminUpdate: (
      artworkId: string,
      data: UpdateArtworkStatusAdmin,
      params: RequestParams = {},
    ) =>
      this.request<UpdateArtworkStatusAdmin, any>({
        path: `/artworks/${artworkId}/update_status_admin/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags artworks
     * @name ArtworksUpdateStatusUserUpdate
     * @request PUT:/artworks/{artwork_id}/update_status_user/
     * @secure
     */
    artworksUpdateStatusUserUpdate: (artworkId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/artworks/${artworkId}/update_status_user/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  characters = {
    /**
     * No description
     *
     * @tags characters
     * @name CharactersList
     * @request GET:/characters/
     * @secure
     */
    charactersList: (
      query?: {
        character_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/characters/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags characters
     * @name CharactersCreateCreate
     * @request POST:/characters/create/
     * @secure
     */
    charactersCreateCreate: (
      data: {
        /**
         * @minLength 1
         * @maxLength 100
         */
        name: string;
        /**
         * @minLength 1
         * @maxLength 500
         */
        description: string;
        /**
         * @min -2147483648
         * @max 2147483647
         */
        category: number;
        /** @format binary */
        image?: File | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<CharacterAdd, any>({
        path: `/characters/create/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags characters
     * @name CharactersRead
     * @request GET:/characters/{character_id}/
     * @secure
     */
    charactersRead: (characterId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/characters/${characterId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags characters
     * @name CharactersAddToArtworkCreate
     * @request POST:/characters/{character_id}/add_to_artwork/
     * @secure
     */
    charactersAddToArtworkCreate: (characterId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/characters/${characterId}/add_to_artwork/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags characters
     * @name CharactersDeleteDelete
     * @request DELETE:/characters/{character_id}/delete/
     * @secure
     */
    charactersDeleteDelete: (characterId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/characters/${characterId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags characters
     * @name CharactersUpdateUpdate
     * @request PUT:/characters/{character_id}/update/
     * @secure
     */
    charactersUpdateUpdate: (characterId: string, data: Character, params: RequestParams = {}) =>
      this.request<Character, any>({
        path: `/characters/${characterId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags characters
     * @name CharactersUpdateImageCreate
     * @request POST:/characters/{character_id}/update_image/
     * @secure
     */
    charactersUpdateImageCreate: (
      characterId: string,
      data: {
        /** @format binary */
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/characters/${characterId}/update_image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/users/login/
     * @secure
     */
    usersLoginCreate: (data: UserLogin, params: RequestParams = {}) =>
      this.request<UserLogin, any>({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersLogoutCreate
     * @request POST:/users/logout/
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/users/register/
     * @secure
     */
    usersRegisterCreate: (data: UserRegister, params: RequestParams = {}) =>
      this.request<UserRegister, any>({
        path: `/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdateUpdate
     * @request PUT:/users/{user_id}/update/
     * @secure
     */
    usersUpdateUpdate: (userId: string, data: UserProfile, params: RequestParams = {}) =>
      this.request<UserProfile, any>({
        path: `/users/${userId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
