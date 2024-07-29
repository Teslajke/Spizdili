
  //
  // Clarity v1.17 (24.07.2024)
  // Part of Chatium Platform
  // https://chatium.com
  //
  ;(function () {

    function getCookie(name) {
      const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const cookieUid = getCookie('x-chtm-uid');
    const cookieSid = getCookie('x-chtm-uid-sid');

    const [visitorId, visitId, sessionId] = findGetcourseFormsVisitorVisitSession()

    let queryUid = null
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.get('clarity_uid')) {
        queryUid = url.searchParams.get('clarity_uid')
      } else {
        if (window.parent) {
          const url = new URL(window.parent.location.href)
          if (url.searchParams.get('clarity_uid')) {
            queryUid = url.searchParams.get('clarity_uid')
          }
        }
      }

      if (queryUid) {
        removeQueryClarityUid();
      }
    } catch (error) {
      console.error(error)
    }

    const uid = queryUid || cookieUid || "qRio5qwJ4eokJXr4mJDdaeRrnRjlDpa2";
    const sid = cookieSid || "spKpg85IOXlYd8_C10SuPSV7vWZBfm8d:1722276699358";

    const inferredUid = cookieUid || queryUid ? false : false;
    const inferredSid = cookieSid ? false : false;

    document.cookie = `x-chtm-uid=${uid}; max-age=31536000; path=/;`;
    document.cookie = `x-chtm-uid-sid=${sid}; max-age=1800; path=/;`;

    const query = {};
    const params = new URLSearchParams(location.search);

    [
      'utm_funnel', 'utm_node', 'utm_node_from',
      'utm_action', 'utm_action_params',
      'utm_action_param1', 'utm_action_param2', 'utm_action_param3',
      'utm_action_param1_float', 'utm_action_param2_float', 'utm_action_param3_float',
      'utm_action_param1_int', 'utm_action_param2_int', 'utm_action_param3_int',
    ].forEach(function (param) {
      if (params.get(param)) query[param] = params.get(param);
    })

    let referer = ''
    try {
      referer = document.referrer || sessionStorage.getItem('x-chtm-rfr') || '';
      sessionStorage.setItem('x-chtm-rfr-p', sessionStorage.getItem('x-chtm-rfr'));
      sessionStorage.setItem('x-chtm-rfr', window.location.href);
    } catch (_) {}

    function enrichUrl(url) {
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('event://')
        ? url
        : 'event://custom/' + url
    }

    window.clrtIsReactive = false
    function appendSocketStoreToBody() {
      if (false || window.clrtReactivity === true) {
        if (window.clrtIsReactive === false) {
          window.clrtIsReactive = true
          console.log('🚀 Clarity reactivity enabled')

          const script = document.createElement('script');
          script.src = "https://kurs.gipnorody.ru/chtm/s/metric/socket-bundle.8dU6jrcTp8rM8.js";
          script.onload = function () {
            const socketStore = new SocketStore({ baseURL: 'wss://app.chatium.io/' });
            socketStore.setToken();
            if (clrtUserSocketId) {
              socketStore.subscribeToData(clrtUserSocketId).listen(function (params) {
                console.log('🛜 Clarity user socket', params)

                window.dispatchEvent(new CustomEvent('claritySocket', { detail: { ...params } } ));
                window.postMessage(JSON.stringify({ source: 'clarity', action: 'claritySocket', params }));
              });
            }
            socketStore.subscribeToData(clrtSocketId).listen(function (params) {
              console.log('🛜 Clarity uid socket', params)

              window.dispatchEvent(new CustomEvent('claritySocket', { detail: { ...params } } ));
              window.postMessage(JSON.stringify({ source: 'clarity', action: 'claritySocket', params }));
            });
          }
          document.body.appendChild(script)
        }
      }
    }

    var clarityInit = false
    function clarityTrack(params) {
      const img = document.createElement('img');
      img.style.position = 'absolute';
      img.style.left = '-1px';
      img.style.top = '-1px';
      img.style.width = '1px';
      img.style.height = '1px';
      img.src = getClarityImageUrl(typeof params === 'string' ? { url: enrichUrl(params) } : params);
      img.onload = function () {
        img.remove();
      };

      function appendTrackerToBody() {
        document.body.appendChild(img)

        try {
          if (clarityInit === false) {
            window.dispatchEvent(new CustomEvent('clarityInit', { detail: { ...params } } ));
            window.postMessage(JSON.stringify({ source: 'clarity', action: 'clarityInit', params }));
          }

          window.dispatchEvent(new CustomEvent('clarityTrack', { detail: { ...params, initial: clarityInit === false } } ));
          window.postMessage(JSON.stringify({ source: 'clarity', action: 'clarityTrack', params: { ...params, initial: clarityInit === false } }));
        } catch (error) {
          console.error(error)
        }

        try {
          if (clarityInit === false) {
            appendSocketStoreToBody()
          }
        } catch (error) {
          console.error(error)
        }

        clarityInit = true
      }

      if (document.body) {
        appendTrackerToBody()
      } else {
        window.addEventListener("DOMContentLoaded", appendTrackerToBody, { once: true })
      }
    }

    function getClarityImageUrl(rewrite) {
      var baseUrl = "https://kurs.gipnorody.ru/chtm/s/metric/clarity.gif"
      var resultReferer = referer
      var resultUrl = document.location.href
      var resultDomain = document.location.hostname

      try {
        const params = new URLSearchParams(document.location.search)
        if (params.get('loc') !== null) {
          resultUrl = params.get('loc')
          var url = new URL(resultUrl)

          resultDomain = url.hostname
        }
        if (params.get('ref') !== null) {
          resultReferer = params.get('ref')
        }
      } catch (error) {
        console.error(error)
      }

      var params = {
        c: Date.now(),
        uid,
        sid,
        referer: resultReferer,
        url: resultUrl,
        domain: resultDomain,
        title: document.title,
        width: screen.width,
        height: screen.height,
        pr: window.devicePixelRatio,
        iuid: inferredUid,
        isid: inferredSid,
        visitor: visitorId,
        visit: visitId,
        session: sessionId,
        enc: window.chtmClarityEncoded ? window.chtmClarityEncoded : undefined,

        ...query,
        ...(rewrite || {}),
      }

      return baseUrl + '?' + Object.keys(params).map(function (param) {
        return params[param] ? param + "=" + encodeURIComponent(params[param]) : ''
      }).filter(Boolean).join('&');
    }

    function exposeUidToGetcourseForms() {
      try {
        function hiddenUidInput() {
          const input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', 'formParams[clarity_uid]');
          input.setAttribute('value', uid);
          input.setAttribute('style', 'display:none;position:absolute;width:0;max-width:0;height:0;max-height:0;left:-999999999px;pointer-events:none;vizability:hidden;')
          return input;
        }


        Array
          .from(document.forms)
          .filter(form => form.getAttribute('action') && form.getAttribute('action').includes('/pl/'))
          .forEach(form => form.appendChild(hiddenUidInput()));

        if (window.location.href.startsWith('https://testchatium1.getcourse.ru/')) {
          formObserver = new MutationObserver(function (records) {
              Array.from(records).forEach(record => {
                  Array.from(record.addedNodes).forEach(record => {
                      if (record instanceof HTMLDivElement) {
                          const forms = record.querySelectorAll('form')

                          Array
                            .from(forms)
                            .filter(form => form.getAttribute('action') && form.getAttribute('action').includes('/pl/'))
                            .forEach(form => form.appendChild(hiddenUidInput()));

                          if (forms.length) {
                            formObserver.disconnect()
                          }
                      }
                  })
              })
          })

          observer = new MutationObserver(function (records) {
              Array.from(records).forEach(record => {
                  Array.from(record.addedNodes).forEach(record => {
                      if (record instanceof HTMLDivElement) {
                          if (record.classList.contains('gc-modal')) {
                              formObserver.observe(record, { childList: true, subtree: true })
                          }
                      }
                  })
              })
          })

          observer.observe(document.body, { childList: true })
        }
      } catch (error) {
        console.error(error);
      }
    }

    function removeQueryClarityUid() {
      try {
        const url = new URL(window.location.href);
        url.searchParams?.delete('clarity_uid');
        if (window.history) {
          window.history.replaceState(null, null, url.toString())
        }
      } catch (error) {
        console.error(error);
      }
    }

    function replaceTelegramStartUid() {
      if (uid) {
        Array.from(document.querySelectorAll('a')).forEach(function (a) {
          if (a.href && a.href.includes('{clarity_uid}')) {
            a.href = a.href.replace('{clarity_uid}', 'uid-' + uid)
          }
        })
      }
    }

    function findGetcourseFormsVisitorVisitSession() {
      try {
        const forms = Array.from(document.forms).filter(form => form.getAttribute('action') && form.getAttribute('action').includes('gcVisitor'))
        if (forms.length > 0) {
          const action = forms[0].getAttribute('action')
          const url = new URL(action)

          let visitorId = undefined
          let visitId = undefined
          let sessionId = undefined

          try {
            const gcVisitorParam = url.searchParams.get('gcVisitor')
            const gcVisitor = JSON.parse(gcVisitorParam)
            if (gcVisitor.id) visitorId = gcVisitor.id
          } catch (_) {}

          try {
            const gcVisitParam = url.searchParams.get('gcVisit')
            const gcVisit = JSON.parse(gcVisitParam)
            if (gcVisit.id) visitId = gcVisit.id
            if (gcVisit.sid) sessionId = gcVisit.sid
          } catch (_) {}

          return [visitorId, visitId, sessionId]
        }
      } catch (error) {
        console.error(error)
      }

      return [undefined, undefined, undefined]
    }

    /** user webinar **/
    function webinarTrack(webinar) {
      if (webinar.status === undefined || (webinar.status != 'opened' && webinar.status != 'started')) {
        setTimeout(() => {
          webinarTrack(window.webinar)
        }, 1000); // wait 1 second, to check status later
        return;
      }

      const webinarId = webinar.id
      const visitorId = webinar.visitorId
      const launchId = webinar.launchId // maybe it's usefull
      const userId = window.accountUserId && window.accountUserId > 0 ? window.accountUserId : ''
      const fullUserId = userId && window.accountId ? window.accountId + ':' + userId : ''

      let adminMode = false;
      if (typeof isAdminView !== "undefined") { // global variable
        adminMode = !!isAdminView
      }
      const viewerMode = adminMode ? 'admin' : 'user'

      clarityTrack({
        url: "event://getcourse/webinar/visit?id=" + encodeURIComponent(webinarId),
        visitor: visitorId,
        userId: fullUserId,
        action_param1: webinarId,
        action_param2: viewerMode,
        action_param1_int: launchId,
      })
    }

    window.chtmClarityTrack = clarityTrack;
    window.rfnl = clarityTrack;
    window.clrtUid = uid;
    window.clrtSid = sid;
    window.clrtTrack = clarityTrack;
    window.clrtTracked = false;
    window.clrtMakeReactive = function () {
      window.clrtReactivity = true;
      appendSocketStoreToBody();
    }
    window.clrtUrlToTelegramBot = function (name) {
      return 'https://t.me/' + name + '?start=uid-' + uid;
    }
    window.clrtRedirectToTelegramBot = function (name, target, windowFeatures) {
      window.open(window.clrtUrlToTelegramBot(name), target, windowFeatures)
    }

    window.startFunnel = function (sceneId) {
      if (sceneId) {
        clarityTrack({
          url: "event://refunnels/startScenario/" + sceneId,
          action: "event_js"
        })
      }
    }

    function trackBehaviour() {
      
      function getTime() {
        if (window.performance && typeof window.performance.now === 'function') {
          return Math.floor(window.performance.now())
        }

        return new Date().getTime()
      }

      const trackingStartedAt = getTime()

      const browserSessionId = sessionStorage.getItem('clrt-v7-session-id') || "b-RLI4OxepaNWIimTAXHQmNkv410wvpV";
      sessionStorage.setItem('clrt-v7-session-id', browserSessionId)

      const browserSessionStartedAt = sessionStorage.getItem('clrt-v7-session-at')
        ? parseInt(sessionStorage.getItem('clrt-v7-session-at'))
        : Date.now();
      sessionStorage.setItem('clrt-v7-session-at', browserSessionStartedAt)

      let viewPercent = 0
      let focused = document.hasFocus()
      let loading = false
      let unfocusedDuration = 0
      let unfocusStartedAt = 0
      let scrollDistance = 0
      let mouseDistance = 0
      let clickCounter = 0
      let selectionLength = 0
      let performanceReady = document.readyState === 'complete'
      let performanceSent = false

      window.addEventListener('load', function (event) {
        performanceReady = true
      })

      document.addEventListener('pointerdown', function (event) {
        clickCounter++
      })

      document.addEventListener('pointerup', function (event) {
        selectionLength = selectionLength + window.getSelection?.()?.toString()?.length
      })

      let sx = null, sy = null
      document.addEventListener('scroll', function (event) {
        if (document.scrollingElement) {
          if (sx !== null) {
            scrollDistance = scrollDistance + Math.abs(document.scrollingElement.scrollLeft - sx)
          }

          if (sy !== null) {
            scrollDistance = scrollDistance + Math.abs(document.scrollingElement.scrollTop - sy)
          }

          sx = document.scrollingElement.scrollLeft
          sy = document.scrollingElement.scrollTop
        }
      })

      let px = null, py = null
      document.addEventListener('mousemove', function (event) {
        if (px !== null) {
          const x = px - event.pageX;
          const y = py - event.pageY;

          mouseDistance = mouseDistance + Math.sqrt(x*x + y*y)
        }

        px = event.pageX
        py = event.pageY
      })

      window.addEventListener('focus', function () {
        focused = true
        if (unfocusStartedAt !== 0) {
          unfocusedDuration = Math.max(0, getTime() - unfocusStartedAt)
          if (getTime() - unfocusStartedAt < 0) {
            console.info('Unfocus duration', getTime() - unfocusStartedAt, getTime(), unfocusStartedAt)
          }
        }
        unfocusStartedAt = 0
      })

      window.addEventListener('blur', function () {
        focused = false
        unfocusStartedAt = getTime()
      })

      window.addEventListener("DOMContentLoaded", () => {
        function documentScrollHandler() {
          viewPercent = Math.max(viewPercent, getViewPercent())
          if (viewPercent === 100) {
            document.removeEventListener("scroll", documentScrollHandler)
          }
        }

        document.addEventListener("scroll", documentScrollHandler)
      }, { once: true })

      function getViewPercent() {
        return Math.round(
          (
            document.scrollingElement.scrollHeight
              ? Math.max(0, Math.min(1, (document.scrollingElement.clientHeight + document.scrollingElement.scrollTop) / document.scrollingElement.scrollHeight))
              : 0
          ) * 100
        )
      }

      function getBehaviourQueryParams() {
        let url = document.location.href

        try {
          const params = new URLSearchParams(document.location.search)
          if (params.get('loc') !== null) {
            url = params.get('loc')
          }
        } catch (error) {
          console.error(error)
        }

        const searchParams = new URLSearchParams()
        searchParams.set('v', 7)
        searchParams.set('uid', uid)
        searchParams.set('sid', sid)
        searchParams.set('url', url)
        searchParams.set('browser_id', browserSessionId)
        searchParams.set('browser_id_started_at', browserSessionStartedAt)
        searchParams.set('view_total_duration', Math.max(0, getTime() - trackingStartedAt))
        searchParams.set('view_focused_duration', Math.max(0, getTime() - trackingStartedAt - unfocusedDuration))
        searchParams.set('mouse_distance', Math.round(mouseDistance))
        searchParams.set('scroll_distance', Math.round(scrollDistance))
        searchParams.set('click_counter', Math.round(clickCounter))
        searchParams.set('selection_length', Math.round(selectionLength))

        if (performanceReady === true && performanceSent === false && window.performance) {
          searchParams.set('performance', JSON.stringify({
            ns: performance.timing.navigationStart,
            ues: performance.timing.unloadEventStart,
            uee: performance.timing.unloadEventEnd,
            rds: performance.timing.redirectStart,
            rde: performance.timing.redirectEnd,
            fs: performance.timing.fetchStart,
            dls: performance.timing.domainLookupStart,
            dle: performance.timing.domainLookupEnd,
            cs: performance.timing.connectStart,
            ce: performance.timing.connectEnd,
            scs: performance.timing.secureConnectionStart,
            rqs: performance.timing.requestStart,
            rss: performance.timing.responseStart,
            rse: performance.timing.responseEnd,
            dl: performance.timing.domLoading,
            di: performance.timing.domInteractive,
            dcles: performance.timing.domContentLoadedEventStart,
            dclee: performance.timing.domContentLoadedEventEnd,
            dc: performance.timing.domComplete,
            les: performance.timing.loadEventStart,
            lee: performance.timing.loadEventEnd,
          }))

          performanceSent = true
        }

        return searchParams
      }

      document.addEventListener("visibilitychange", function sendBehaviourBeacon() {
        if (document.visibilityState === "hidden") {
          navigator.sendBeacon(
            "https://kurs.gipnorody.ru/chtm/s/metric/behaviourBeacon" + '?' + getBehaviourQueryParams().toString()
          );
        }
      });

      function appendBehaviourImage() {
        if (loading) {
          return false
        }

        loading = true

        const img = document.createElement('img');
        img.style.position = 'absolute';
        img.style.left = '-1px';
        img.style.top = '-1px';
        img.style.width = '1px';
        img.style.height = '1px';
        img.src = "https://kurs.gipnorody.ru/chtm/s/metric/behaviour.gif" + '?' + getBehaviourQueryParams().toString();
        img.onload = function () {
          img.remove();
          loading = false
        };
        img.onerror = function () {
          loading = false
        }

        function appendTrackerToBody() {
          document.body.appendChild(img)
        }

        if (document.body) {
          appendTrackerToBody()
        } else {
          window.addEventListener("DOMContentLoaded", appendTrackerToBody, { once: true })
        }
      }

      setInterval(function () {
        if (focused) {
          appendBehaviourImage()
        }
      }, 10 * 1000)

      appendBehaviourImage()
    }

    function setup() {
      if (window.clrtTracked === false) {
        window.clrtTracked = true

        if (window.gcUniqId !== undefined) {
          try {
            if (localStorage.getItem('visit')) {
              clarityTrack();
            } else {
              const start = Date.now()
              const handler = setInterval(checkVisit, 500);

              function checkVisit() {
                if (localStorage.getItem('visit') || Date.now() - start > 1000 * 10) {
                  clearInterval(handler);
                  clarityTrack();
                }
              }
            }
          } catch (_) {
            clarityTrack();
          }
        } else {
          clarityTrack();
        }
      }
      // window.webinar object is not empty, has not empty "sign" property we are on a certain page
      if (window.webinar !== undefined && window.location.pathname.indexOf('pl/webinar/show') !== -1) {
        setTimeout(() => {
          webinarTrack(window.webinar)
        }, 10000); // wait 10 seconds, to be shure, that user hasn't closed the page.
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setup()
      }, { once: true });
    } else {
      setup()
    }

    exposeUidToGetcourseForms();
    replaceTelegramStartUid();

    try {
      trackBehaviour();
    } catch (error) {
      console.error('trackBehaviour', error)
    }

  })();
