import React from 'react';

import { isObject } from '../../common/utils';

function swapAndFixFilterStrings(incoming) {
  const mappings = {
    niches_5_0: 'Personas',
    children: 'Child',
  };
  return mappings[incoming] ?? incoming.replace(/_any|_all|mt_/gi, '').replace(/_/gi, ' ');
}

const HIDDEN_FIELDS = ['required'];

export const getFilterJSONText = (filterjson = {}) => (
  <>
    <table>
      {Object.keys(filterjson).map(
        (
          c,
          ci //Iterate through categories objects
        ) => (
          <tbody key={ci}>
            <tr>
              <td className="form-title form-subtitle filter-json-title form-text" colSpan={3}>
                {c}
              </td>
            </tr>
            {
              // Iterate through filter objects
              Object.keys(filterjson[c]).map((fname, fi) => (
                <tr key={fi} className="segment-filter-display-tr">
                  <td className="form-text filter-name bold capitalize segment-card-column-width">
                    {swapAndFixFilterStrings(fname)}
                  </td>
                  <td>
                    <span className="colon">:</span>
                  </td>
                  <td className="segment-card-column-width" colSpan={3}>
                    {
                      // TODO: Make it recursive
                      // Process filters whose values are not arrays or objects
                      !isObject(filterjson[c][fname]) ? (
                        <span>{filterjson[c][fname]}</span>
                      ) : // Process filters whose values are arrays
                      Array.isArray(filterjson[c][fname]) ? (
                        filterjson[c][fname].map((v, i) => (
                          <span key={i}>
                            {!isObject(v)
                              ? `${v}, `
                              : Array.isArray(v)
                              ? v.join(', ')
                              : Object.entries(v).map(([vk, vv]) => (
                                  <span key={vk}>
                                    ({vk}): {vv || 'Any'}
                                    <br />
                                  </span>
                                ))}
                          </span>
                        ))
                      ) : (
                        // Process filters whose values are objects
                        <span>
                          {Object.entries(filterjson[c][fname])
                            .filter(([f]) => !HIDDEN_FIELDS.includes(f))
                            .map(([k, v]) =>
                              !isObject(v) ? (
                                <span key={k}>
                                  ({k}): {v || 'Any'}
                                  <br />
                                </span>
                              ) : Array.isArray(v) && c !== 'Credit' && fname !== 'Individual' ? (
                                v.map((vv, vi) => (
                                  <span key={vi}>
                                    <div className="bold">{`${swapAndFixFilterStrings(fname)} ${vi + 1}`}</div>
                                    {!isObject(vv)
                                      ? `${vv}, `
                                      : Array.isArray(vv)
                                      ? vv.join(', ')
                                      : Object.entries(vv).map(([vvk, vvv]) =>
                                          !isObject(vvv) ? (
                                            <span key={vvk}>
                                              ({vvk}): {vvv || 'Any'}
                                              <br />
                                            </span>
                                          ) : Array.isArray(vvv) ? (
                                            <span key={vvk}>
                                              {vvv.join(' - ')} ({vvk})<br />
                                            </span>
                                          ) : (
                                            Object.entries(vvv).map(([vvvk, vvvv]) => (
                                              <span key={vvvk}>
                                                ({vvvk}): {vvvv || 'Any'} <br />
                                              </span>
                                            ))
                                          )
                                        )}
                                  </span>
                                ))
                              ) : fname === 'Individual' && c !== 'Credit' ? (
                                <span> {`age:  ${v[0]}  to ${v[1]}`}</span>
                              ) : c === 'Credit' ? (
                                <span key={`credit-${k}`}>
                                  <div className="bold capitalize ">{`${swapAndFixFilterStrings(k)}`}</div>
                                  {v.map((vv, vi) => (
                                    <span key={`${vi}credit_key`}>{`${vv}, `}</span>
                                  ))}
                                </span>
                              ) : (
                                Object.entries(v).map(([vk, vv]) => (
                                  <span key={vk}>
                                    ({vk}): {vv || 'Any'}
                                    <br />
                                  </span>
                                ))
                              )
                            )}
                        </span>
                      )
                    }
                  </td>
                </tr>
              ))
            }
          </tbody>
        )
      )}
    </table>
  </>
);
