import got, {
  GotJSONOptions,
  Response,
  GotJSONFn,
  GotOptions,
  GotPromise,
} from 'got';

type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH';

export function createServiceClient(
  baseURL: string,
  baseGotConfig?: GotJSONOptions | GotOptions<string>,
) {
  const gotInstance = got.extend({
    baseUrl: baseURL,
    headers: {
      Accept: 'application/json',
      'X-Initiator': 'service-platform',
    },
    retry: 0,
    json: true,
    ...(baseGotConfig || {}),
  });

  const request = async <T extends Buffer | string | object>(
    method: Method = 'post',
    path: string,
    data?: Partial<GotJSONOptions>,
  ): Promise<T> => {
    const fn = gotInstance[method.toLowerCase()] as GotJSONFn;

    const res: Response<T> = await fn(path, data);

    return res.body;
  };

  return request;
}
