
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.55.0 */

    function create_fragment$b(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.55.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.55.0 */
    const file$8 = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$9(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$8, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Home1.svelte generated by Svelte v3.55.0 */

    const file$7 = "src\\pages\\Home1.svelte";

    function create_fragment$8(ctx) {
    	let div6;
    	let div0;
    	let t1;
    	let div3;
    	let div1;
    	let t3;
    	let div2;
    	let t5;
    	let div4;
    	let b0;
    	let t7;
    	let b1;
    	let t9;
    	let div5;
    	let t10;
    	let br0;
    	let t11;
    	let br1;
    	let t12;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			div0.textContent = "Hola 👋";
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "soy";
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "Erick Mamani";
    			t5 = space();
    			div4 = element("div");
    			b0 = element("b");
    			b0.textContent = "Analista";
    			t7 = text(" e ");
    			b1 = element("b");
    			b1.textContent = "Ingeniero de Datos";
    			t9 = space();
    			div5 = element("div");
    			t10 = text("Soy un analista de datos con formación en análisis e ingeniería de datos, con experiencia en el rubro comercial.\r\n        ");
    			br0 = element("br");
    			t11 = text("\r\n        Me apasiona la programación y el diseño minimalista, utilizo estas habilidades para crear dashboards que se publican en forma de aplicaciones web.\r\n        ");
    			br1 = element("br");
    			t12 = text("\r\n        Mis productos son visualmente atractivos y fáciles de usar, diseñados para ayudar a los usuarios a tomar decisiones basadas en sus datos");
    			attr_dev(div0, "class", "hola svelte-alzmst");
    			add_location(div0, file$7, 1, 4, 41);
    			attr_dev(div1, "class", "light svelte-alzmst");
    			add_location(div1, file$7, 3, 8, 107);
    			attr_dev(div2, "class", "name svelte-alzmst");
    			add_location(div2, file$7, 4, 8, 145);
    			attr_dev(div3, "class", "title svelte-alzmst");
    			add_location(div3, file$7, 2, 4, 78);
    			add_location(b0, file$7, 6, 26, 221);
    			add_location(b1, file$7, 6, 44, 239);
    			attr_dev(div4, "class", "position svelte-alzmst");
    			add_location(div4, file$7, 6, 4, 199);
    			add_location(br0, file$7, 9, 8, 433);
    			add_location(br1, file$7, 11, 8, 603);
    			attr_dev(div5, "class", "description svelte-alzmst");
    			add_location(div5, file$7, 7, 4, 276);
    			attr_dev(div6, "class", "portfolio-description svelte-alzmst");
    			add_location(div6, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div6, t1);
    			append_dev(div6, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div6, t5);
    			append_dev(div6, div4);
    			append_dev(div4, b0);
    			append_dev(div4, t7);
    			append_dev(div4, b1);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			append_dev(div5, t10);
    			append_dev(div5, br0);
    			append_dev(div5, t11);
    			append_dev(div5, br1);
    			append_dev(div5, t12);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home1', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home1> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home1",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const projects = [
        {
            title: "Plato's Pizza",
            preview: './images/projects/pizza.png',
            desc: "Realicé trabajos de ETL y análisis sobre datasets de accidentes aéreos. Construí un dashboard que se puede visualizar en la web utilizando Dash y Plotly, con el fin de presentar los resultados del análisis.",
            pdf: './pdfs/pizza.pdf',
            url: 'https://maven-pizza-xqfi.onrender.com',
            stack: ['Python', 'Figma', 'Dash & Plotly']
            
        },
        {
            title: "ICAO Analisis de Accidentes Aereos",
            preview: './images/projects/icao.png',
            desc: "Desarrollé un dashboard en formato de aplicación web utilizando Dash y Plotly en base al analisis de varios datasets con informacion referente a las operaciones de una pizzeria del año 2015",
            pdf: './pdfs/icao.pdf',
            url: 'https://icao-dashboard.onrender.com',
            stack: ['Python', 'Dash & Plotly', 'Pandas','MySQL', 'Figma']
            
        },
        {
            title: "Sistema de recomendacion de Restaurantes",
            preview: './images/projects/users.png',
            desc: "Realicé un análisis de las tendencias de consumo de los usuarios para construir un sistema de recomendación personalizado utilice Dash y Plotly para desarrollar una aplicación web que permita a los usuarios tanto antiguos como nuevos, poder recibir recomendaciones de restaurantes que vayan acorde a sus experiencias previas",
            pdf: './pdfs/users.pdf',
            stack: ['Python','Pandas', 'Dash & Plotly', 'Figma', 'Google Cloud SQL'],
            url:""
            
        },
        {
            title: "Dashboards de tendencia, riesgo y oportunidad para invertir en negocios en Estados Unidos",
            preview: './images/projects/risk.jpg',
            desc: 'Análisis sobre las tendencias, oportunidades y riesgos de inversion en distintos rubros, la data para este analisis se obtuvo de Yelp, una plataforma de reviews de negocios, tambien se elaboraron 3 dashboard en un trabajo colaborativo usando tecnologias de big data.',
            pdf: './pdfs/trending.pdf',
            url: '',
            stack: ['Python','Pandas','Google Cloud SQL','Dash & Plotly', 'Figma','Sass']
        }
    ];

    /* src\pages\LastProjects.svelte generated by Svelte v3.55.0 */
    const file$6 = "src\\pages\\LastProjects.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i].title;
    	child_ctx[1] = list[i].preview;
    	child_ctx[2] = list[i].desc;
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (9:8) {#if i<2}
    function create_if_block$1(ctx) {
    	let div3;
    	let img;
    	let img_src_value;
    	let t0;
    	let div2;
    	let div0;
    	let t1_value = /*title*/ ctx[0] + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*desc*/ ctx[2] + "";
    	let t3;
    	let t4;
    	let div4;
    	let hr;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			img = element("img");
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div4 = element("div");
    			hr = element("hr");
    			if (!src_url_equal(img.src, img_src_value = /*preview*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[0]);
    			attr_dev(img, "class", "svelte-17nh65g");
    			add_location(img, file$6, 11, 12, 283);
    			attr_dev(div0, "class", "desc-title svelte-17nh65g");
    			add_location(div0, file$6, 13, 16, 371);
    			attr_dev(div1, "class", "desc-extense svelte-17nh65g");
    			add_location(div1, file$6, 14, 16, 426);
    			attr_dev(div2, "class", "description svelte-17nh65g");
    			add_location(div2, file$6, 12, 12, 328);
    			attr_dev(div3, "class", "container svelte-17nh65g");
    			add_location(div3, file$6, 10, 8, 246);
    			attr_dev(hr, "class", "svelte-17nh65g");
    			add_location(hr, file$6, 17, 31, 533);
    			attr_dev(div4, "class", "separador");
    			add_location(div4, file$6, 17, 8, 510);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, img);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, hr);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(9:8) {#if i<2}",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#each projects as { title, preview, desc  }
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[4] < 2 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[4] < 2) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(8:4) {#each projects as { title, preview, desc  }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let each_value = projects;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Mis ultimos proyectos";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "title svelte-17nh65g");
    			add_location(div0, file$6, 5, 4, 96);
    			attr_dev(div1, "class", "projects svelte-17nh65g");
    			add_location(div1, file$6, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects*/ 0) {
    				each_value = projects;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LastProjects', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LastProjects> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ projects });
    	return [];
    }

    class LastProjects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LastProjects",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const skills = [
        {
            name: 'Python',
            src: './images/skills/python.svg',
            keyword: 'Analitica',
        },
        {
            name: 'Google Cloud SQL',
            src: './images/skills/cloudsql.svg',
            keyword: 'Bases de Datos',
        },
        {
            name: 'Looker Studio',
            src: './images/skills/looker.svg',
            keyword: 'Analitica',
        },
        {
            name: 'MySQL',
            src: './images/skills/mysql.svg',
            keyword: 'Bases de Datos',
        },
        {
            name: 'Pandas',
            src: './images/skills/pandas.svg',
            keyword: 'Analitica',
        },
        {
            name: 'Dash & Plotly',
            src: './images/skills/plotly.svg',
            keyword: 'Disenio',
        },
        {
            name: 'PostgresSQL',
            src: './images/skills/postgres.svg',
            keyword: 'Bases de Datos',
        },
        {
            name: 'Power BI',
            src: './images/skills/powerbi.svg',
            keyword: 'Analitica',
        },
        {
            name: 'Excel',
            src: './images/skills/excel.svg',
            keyword: 'Analitica',
        },
        {
            name: 'Figma',
            src: './images/skills/figma.svg',
            keyword: 'Disenio',
        },
        {
            name: 'CSS',
            src: './images/skills/css.svg',
            keyword: 'Disenio',
        },
        {
            name: 'Git',
            src: './images/skills/git.svg',
            keyword: 'Otras skills',
        },
        {
            name: 'HTML',
            src: './images/skills/html.svg',
            keyword: 'Disenio',
        },
        {
            name: 'Javascript',
            src: './images/skills/javascript.svg',
            keyword: 'Otras',
        },
        {
            name: 'Linux',
            src: './images/skills/linux.svg',
            keyword: 'Otras skills',
        },
        {
            name: 'Sass',
            src: './images/skills/sass.svg',
            keyword: 'Disenio',
        },
        {
            name: 'Selenium',
            src: './images/skills/selenium.svg',
            keyword: 'Otras',
        },
        {
            name: 'Svelte',
            src: './images/skills/svelte.svg',
            keyword: 'Disenio',
        },
        {
            name: 'Tableau',
            src: './images/skills/tableau.svg',
            keyword: 'Analitica',
        },

    ];

    /* src\pages\Proyectos.svelte generated by Svelte v3.55.0 */
    const file$5 = "src\\pages\\Proyectos.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i].title;
    	child_ctx[1] = list[i].preview;
    	child_ctx[2] = list[i].desc;
    	child_ctx[3] = list[i].pdf;
    	child_ctx[4] = list[i].stack;
    	child_ctx[5] = list[i].url;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i].name;
    	child_ctx[9] = list[i].src;
    	return child_ctx;
    }

    // (29:28) {#if stack.includes(name) }
    function create_if_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[9])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1g7bxxk");
    			add_location(img, file$5, 29, 32, 1006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(29:28) {#if stack.includes(name) }",
    		ctx
    	});

    	return block;
    }

    // (28:28) {#each skills as {name, src}
    function create_each_block_1(ctx) {
    	let show_if = /*stack*/ ctx[4].includes(/*name*/ ctx[8]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (show_if) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(28:28) {#each skills as {name, src}",
    		ctx
    	});

    	return block;
    }

    // (38:24) {#if pdf != ""}
    function create_if_block_1(ctx) {
    	let div;
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text("estatica");
    			attr_dev(a, "href", /*pdf*/ ctx[3]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "class", "svelte-1g7bxxk");
    			add_location(a, file$5, 39, 32, 1389);
    			attr_dev(div, "class", "static svelte-1g7bxxk");
    			add_location(div, file$5, 38, 24, 1335);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(38:24) {#if pdf != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (43:24) {#if url != ""}
    function create_if_block(ctx) {
    	let div;
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text("interactiva");
    			attr_dev(a, "href", /*url*/ ctx[5]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "class", "svelte-1g7bxxk");
    			add_location(a, file$5, 44, 32, 1651);
    			attr_dev(div, "class", "interactive svelte-1g7bxxk");
    			add_location(div, file$5, 43, 24, 1592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(43:24) {#if url != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#each projects as { title, preview, desc , pdf , stack, url }
    function create_each_block$1(ctx) {
    	let div10;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div9;
    	let div1;
    	let t1_value = /*title*/ ctx[0] + "";
    	let t1;
    	let t2;
    	let div2;
    	let t3_value = /*desc*/ ctx[2] + "";
    	let t3;
    	let t4;
    	let div8;
    	let div5;
    	let div3;
    	let t6;
    	let div4;
    	let t7;
    	let div7;
    	let div6;
    	let t9;
    	let t10;
    	let t11;
    	let each_value_1 = skills;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block0 = /*pdf*/ ctx[3] != "" && create_if_block_1(ctx);
    	let if_block1 = /*url*/ ctx[5] != "" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div9 = element("div");
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div8 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "stack:";
    			t6 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div6.textContent = "version:";
    			t9 = space();
    			if (if_block0) if_block0.c();
    			t10 = space();
    			if (if_block1) if_block1.c();
    			t11 = space();
    			if (!src_url_equal(img.src, img_src_value = /*preview*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1g7bxxk");
    			add_location(img, file$5, 18, 16, 465);
    			attr_dev(div0, "class", "preview svelte-1g7bxxk");
    			add_location(div0, file$5, 17, 12, 426);
    			attr_dev(div1, "class", "title svelte-1g7bxxk");
    			add_location(div1, file$5, 21, 16, 570);
    			attr_dev(div2, "class", "desc");
    			add_location(div2, file$5, 22, 16, 620);
    			attr_dev(div3, "class", "stack-subtitle svelte-1g7bxxk");
    			add_location(div3, file$5, 25, 24, 760);
    			attr_dev(div4, "class", "stack-container svelte-1g7bxxk");
    			add_location(div4, file$5, 26, 24, 826);
    			attr_dev(div5, "class", "tecnologias svelte-1g7bxxk");
    			add_location(div5, file$5, 24, 20, 709);
    			attr_dev(div6, "class", "version svelte-1g7bxxk");
    			add_location(div6, file$5, 36, 24, 1233);
    			attr_dev(div7, "class", "entregables svelte-1g7bxxk");
    			add_location(div7, file$5, 35, 20, 1182);
    			attr_dev(div8, "class", "stack svelte-1g7bxxk");
    			add_location(div8, file$5, 23, 16, 668);
    			attr_dev(div9, "class", "description svelte-1g7bxxk");
    			add_location(div9, file$5, 20, 12, 527);
    			attr_dev(div10, "class", "proyecto svelte-1g7bxxk");
    			add_location(div10, file$5, 16, 8, 390);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div0);
    			append_dev(div0, img);
    			append_dev(div10, t0);
    			append_dev(div10, div9);
    			append_dev(div9, div1);
    			append_dev(div1, t1);
    			append_dev(div9, t2);
    			append_dev(div9, div2);
    			append_dev(div2, t3);
    			append_dev(div9, t4);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t6);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t9);
    			if (if_block0) if_block0.m(div7, null);
    			append_dev(div7, t10);
    			if (if_block1) if_block1.m(div7, null);
    			append_dev(div10, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*skills, projects*/ 0) {
    				each_value_1 = skills;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*pdf*/ ctx[3] != "") if_block0.p(ctx, dirty);
    			if (/*url*/ ctx[5] != "") if_block1.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(15:4) {#each projects as { title, preview, desc , pdf , stack, url }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let each_value = projects;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "proyectos svelte-1g7bxxk");
    			add_location(div, file$5, 12, 0, 275);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects, skills*/ 0) {
    				each_value = projects;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Proyectos', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Proyectos> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ projects, skills });
    	return [];
    }

    class Proyectos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Proyectos",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\pages\Skills.svelte generated by Svelte v3.55.0 */
    const file$4 = "src\\pages\\Skills.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i].name;
    	child_ctx[1] = list[i].src;
    	return child_ctx;
    }

    // (10:4) {#each skills as {name, src}
    function create_each_block(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let t1_value = /*name*/ ctx[0] + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*name*/ ctx[0]);
    			attr_dev(img, "class", "svelte-1hqb6zr");
    			add_location(img, file$4, 13, 12, 212);
    			attr_dev(div0, "class", "image svelte-1hqb6zr");
    			add_location(div0, file$4, 12, 8, 179);
    			attr_dev(div1, "class", "name svelte-1hqb6zr");
    			add_location(div1, file$4, 15, 8, 266);
    			attr_dev(div2, "class", "skill-container svelte-1hqb6zr");
    			add_location(div2, file$4, 11, 4, 140);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div2, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(10:4) {#each skills as {name, src}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let each_value = skills;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "skills svelte-1hqb6zr");
    			add_location(div, file$4, 7, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*skills*/ 0) {
    				each_value = skills;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ skills });
    	return [];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\pages\Sobre_mi.svelte generated by Svelte v3.55.0 */

    const file$3 = "src\\pages\\Sobre_mi.svelte";

    function create_fragment$4(ctx) {
    	let div74;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let t5;
    	let div3;
    	let t7;
    	let div12;
    	let div11;
    	let div6;
    	let div4;
    	let t8;
    	let div5;
    	let t9;
    	let div10;
    	let div7;
    	let t11;
    	let div8;
    	let t13;
    	let div9;
    	let t15;
    	let div21;
    	let div20;
    	let div15;
    	let div13;
    	let t16;
    	let div14;
    	let t17;
    	let div19;
    	let div16;
    	let t19;
    	let div17;
    	let t21;
    	let div18;
    	let t23;
    	let div30;
    	let div29;
    	let div24;
    	let div22;
    	let t24;
    	let div23;
    	let t25;
    	let div28;
    	let div25;
    	let t27;
    	let div26;
    	let t29;
    	let div27;
    	let t30;
    	let br2;
    	let t31;
    	let a;
    	let t33;
    	let div39;
    	let div38;
    	let div33;
    	let div31;
    	let t34;
    	let div32;
    	let t35;
    	let div37;
    	let div34;
    	let t37;
    	let div35;
    	let t39;
    	let div36;
    	let t41;
    	let div48;
    	let div47;
    	let div42;
    	let div40;
    	let t42;
    	let div41;
    	let t43;
    	let div46;
    	let div43;
    	let t45;
    	let div44;
    	let t47;
    	let div45;
    	let t49;
    	let div49;
    	let t51;
    	let div57;
    	let div56;
    	let div52;
    	let div50;
    	let t52;
    	let div51;
    	let t53;
    	let div55;
    	let div53;
    	let t55;
    	let div54;
    	let t57;
    	let div65;
    	let div64;
    	let div60;
    	let div58;
    	let t58;
    	let div59;
    	let t59;
    	let div63;
    	let div61;
    	let t61;
    	let div62;
    	let t63;
    	let div73;
    	let div72;
    	let div68;
    	let div66;
    	let t64;
    	let div67;
    	let t65;
    	let div71;
    	let div69;
    	let t67;
    	let div70;

    	const block = {
    		c: function create() {
    			div74 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Perfil";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Soy un profesional con experiencia en el área comercial y auditoria publica. Mi primer acercamiento con los datos se dio a través del uso de software CRM para la toma de decisiones y la planificación de estrategias comerciales.\r\n            ");
    			br0 = element("br");
    			t3 = text("\r\n            Me inicie en el mundo de la programación de manera autodidacta, cuando escribí mi primer script de web scraping para obtener precios de una tienda virtual de licores.\r\n            Motivado por lo que podría llegar a hacer con Python, encontré el bootcamp de Henry.\r\n            Desde ahí he adquirido conocimientos en Python, SQL, GCP y herramientas de visualización de datos como Dash, Plotly, Tableau y Looker Studio.\r\n            ");
    			br1 = element("br");
    			t4 = text("\r\n            Me interesa seguir desarrollando mis habilidades y adquiriendo nuevos conocimientos en este campo dinámico y emocionante, y estoy dispuesto a trabajar duro para lograr mis metas en el mundo de los datos.");
    			t5 = space();
    			div3 = element("div");
    			div3.textContent = "Experiencia";
    			t7 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			t8 = space();
    			div5 = element("div");
    			t9 = space();
    			div10 = element("div");
    			div7 = element("div");
    			div7.textContent = "Analista de datos en Henry (académico)";
    			t11 = space();
    			div8 = element("div");
    			div8.textContent = "nov. 2022 a dic. 2022, Argentina";
    			t13 = space();
    			div9 = element("div");
    			div9.textContent = "Como colaborador en un proyecto de análisis de datos, mis tareas principales fueron la creación y administración de pipelines de ETL (extracción, transformación y carga de datos) en datasets de gran tamaño. Además, construí y administré la base de datos en Google Cloud SQL que se usó en el proyecto. También realicé un análisis de las tendencias de consumo de los usuarios para construir un sistema de recomendación personalizado. Finalmente, utilicé las herramientas Dash y Plotly para desarrollar una aplicación web donde se mostraron los dos productos finales del proyecto.";
    			t15 = space();
    			div21 = element("div");
    			div20 = element("div");
    			div15 = element("div");
    			div13 = element("div");
    			t16 = space();
    			div14 = element("div");
    			t17 = space();
    			div19 = element("div");
    			div16 = element("div");
    			div16.textContent = "Analista de datos en Henry (académico)";
    			t19 = space();
    			div17 = element("div");
    			div17.textContent = "oct. 2022 a nov. 2022, Argentina";
    			t21 = space();
    			div18 = element("div");
    			div18.textContent = "Realicé trabajos de ETL y análisis sobre datasets de accidentes aéreos obtenidos de la Organización de Aviación Civil Internacional.\r\n                    Construí un dashboard que se puede visualizar en la web utilizando Dash y Plotly, con el fin de presentar los resultados del análisis.";
    			t23 = space();
    			div30 = element("div");
    			div29 = element("div");
    			div24 = element("div");
    			div22 = element("div");
    			t24 = space();
    			div23 = element("div");
    			t25 = space();
    			div28 = element("div");
    			div25 = element("div");
    			div25.textContent = "Analista de datos en Maven Analytics (académico)";
    			t27 = space();
    			div26 = element("div");
    			div26.textContent = "sept. 2022 a oct. 2022";
    			t29 = space();
    			div27 = element("div");
    			t30 = text("Desarrollé un dashboard en formato de aplicación web utilizando Dash y Plotly en base al analisis de varios datasets con informacion referente a las operaciones de una pizzeria del año 2015.\r\n                    El caso de estudio planteado por Maven Analytics se centró en la optimización del proceso de trabajo y atención a los clientes en una pizzería. ");
    			br2 = element("br");
    			t31 = text("\r\n                    Link de los requerimientos minimos del caso de estudio: \r\n                    ");
    			a = element("a");
    			a.textContent = "Maven Pizza Challenge";
    			t33 = space();
    			div39 = element("div");
    			div38 = element("div");
    			div33 = element("div");
    			div31 = element("div");
    			t34 = space();
    			div32 = element("div");
    			t35 = space();
    			div37 = element("div");
    			div34 = element("div");
    			div34.textContent = "Analista Comerial en Inox Supply Ingenieria";
    			t37 = space();
    			div35 = element("div");
    			div35.textContent = "2020 a 2022, La Paz, Bolivia";
    			t39 = space();
    			div36 = element("div");
    			div36.textContent = "Uso de herramientas de análisis de datos para identificar tendencias y patrones en el comportamiento de los clientes y el inventario.\r\n                    Elaboración de informes de análisis de datos de clientes e inventario usando tablas dinamicas y graficas.\r\n                    Comunicación con el equipo de marketing para coordinar la implementación de los planes de acción.";
    			t41 = space();
    			div48 = element("div");
    			div47 = element("div");
    			div42 = element("div");
    			div40 = element("div");
    			t42 = space();
    			div41 = element("div");
    			t43 = space();
    			div46 = element("div");
    			div43 = element("div");
    			div43.textContent = "Auxiliar de Auditoria en CMLP - Comisión de Desarrollo Económico y Financiero";
    			t45 = space();
    			div44 = element("div");
    			div44.textContent = "2018 a 2020, La Paz, Bolivia";
    			t47 = space();
    			div45 = element("div");
    			div45.textContent = "Trabajo en el área de Control de Obras del municipio de La Paz en colaboración con el equipo de abogados y arquitectos, donde se lleva a cabo el seguimiento, análisis y evaluación de los contratos de obras públicas.\r\n                    Medición del cumplimiento de los plazos y presupuestos establecidos en los contratos, y del grado de satisfacción de la comunidad con las obras realizadas";
    			t49 = space();
    			div49 = element("div");
    			div49.textContent = "Formacion";
    			t51 = space();
    			div57 = element("div");
    			div56 = element("div");
    			div52 = element("div");
    			div50 = element("div");
    			t52 = space();
    			div51 = element("div");
    			t53 = space();
    			div55 = element("div");
    			div53 = element("div");
    			div53.textContent = "Data Scientist";
    			t55 = space();
    			div54 = element("div");
    			div54.textContent = "2022 a 2022 en Henry Bootcamp, Argentina";
    			t57 = space();
    			div65 = element("div");
    			div64 = element("div");
    			div60 = element("div");
    			div58 = element("div");
    			t58 = space();
    			div59 = element("div");
    			t59 = space();
    			div63 = element("div");
    			div61 = element("div");
    			div61.textContent = "Auditoria Contable (ultimo año)";
    			t61 = space();
    			div62 = element("div");
    			div62.textContent = "2022 a 2022 en Henry Bootcamp, Argentina";
    			t63 = space();
    			div73 = element("div");
    			div72 = element("div");
    			div68 = element("div");
    			div66 = element("div");
    			t64 = space();
    			div67 = element("div");
    			t65 = space();
    			div71 = element("div");
    			div69 = element("div");
    			div69.textContent = "Contabilidad General (Tecnicatura)";
    			t67 = space();
    			div70 = element("div");
    			div70.textContent = "2015 a 2018 en Instituto de Educacion Bancaria, Bolivia";
    			attr_dev(div0, "class", "title svelte-1928jh3");
    			add_location(div0, file$3, 2, 8, 56);
    			add_location(br0, file$3, 5, 12, 377);
    			add_location(br1, file$3, 9, 12, 828);
    			attr_dev(div1, "class", "description svelte-1928jh3");
    			add_location(div1, file$3, 3, 8, 97);
    			attr_dev(div2, "class", "header svelte-1928jh3");
    			add_location(div2, file$3, 1, 4, 26);
    			attr_dev(div3, "class", "title-exp svelte-1928jh3");
    			add_location(div3, file$3, 14, 4, 1085);
    			attr_dev(div4, "class", "dot svelte-1928jh3");
    			add_location(div4, file$3, 18, 16, 1243);
    			attr_dev(div5, "class", "line svelte-1928jh3");
    			add_location(div5, file$3, 19, 16, 1284);
    			attr_dev(div6, "class", "line-container svelte-1928jh3");
    			add_location(div6, file$3, 17, 12, 1197);
    			attr_dev(div7, "class", "cargo svelte-1928jh3");
    			add_location(div7, file$3, 22, 16, 1388);
    			attr_dev(div8, "class", "tiempo svelte-1928jh3");
    			add_location(div8, file$3, 23, 16, 1469);
    			attr_dev(div9, "class", "exp-description svelte-1928jh3");
    			add_location(div9, file$3, 24, 16, 1545);
    			attr_dev(div10, "class", "text-container svelte-1928jh3");
    			add_location(div10, file$3, 21, 12, 1342);
    			attr_dev(div11, "class", "demo1 svelte-1928jh3");
    			add_location(div11, file$3, 16, 8, 1164);
    			attr_dev(div12, "class", "demo-main svelte-1928jh3");
    			add_location(div12, file$3, 15, 4, 1131);
    			attr_dev(div13, "class", "dot svelte-1928jh3");
    			add_location(div13, file$3, 31, 16, 2323);
    			attr_dev(div14, "class", "line svelte-1928jh3");
    			add_location(div14, file$3, 32, 16, 2364);
    			attr_dev(div15, "class", "line-container svelte-1928jh3");
    			add_location(div15, file$3, 30, 12, 2277);
    			attr_dev(div16, "class", "cargo svelte-1928jh3");
    			add_location(div16, file$3, 35, 16, 2468);
    			attr_dev(div17, "class", "tiempo svelte-1928jh3");
    			add_location(div17, file$3, 36, 16, 2549);
    			attr_dev(div18, "class", "exp-description svelte-1928jh3");
    			add_location(div18, file$3, 37, 16, 2625);
    			attr_dev(div19, "class", "text-container svelte-1928jh3");
    			add_location(div19, file$3, 34, 12, 2422);
    			attr_dev(div20, "class", "demo1 svelte-1928jh3");
    			add_location(div20, file$3, 29, 8, 2244);
    			attr_dev(div21, "class", "demo-main svelte-1928jh3");
    			add_location(div21, file$3, 28, 4, 2211);
    			attr_dev(div22, "class", "dot svelte-1928jh3");
    			add_location(div22, file$3, 47, 16, 3154);
    			attr_dev(div23, "class", "line svelte-1928jh3");
    			add_location(div23, file$3, 48, 16, 3195);
    			attr_dev(div24, "class", "line-container svelte-1928jh3");
    			add_location(div24, file$3, 46, 12, 3108);
    			attr_dev(div25, "class", "cargo svelte-1928jh3");
    			add_location(div25, file$3, 51, 16, 3299);
    			attr_dev(div26, "class", "tiempo svelte-1928jh3");
    			add_location(div26, file$3, 52, 16, 3390);
    			add_location(br2, file$3, 55, 164, 3863);
    			attr_dev(a, "href", "https://www.mavenanalytics.io/blog/maven-pizza-challenge");
    			attr_dev(a, "class", "svelte-1928jh3");
    			add_location(a, file$3, 57, 20, 3967);
    			attr_dev(div27, "class", "exp-description svelte-1928jh3");
    			add_location(div27, file$3, 53, 16, 3456);
    			attr_dev(div28, "class", "text-container svelte-1928jh3");
    			add_location(div28, file$3, 50, 12, 3253);
    			attr_dev(div29, "class", "demo1 svelte-1928jh3");
    			add_location(div29, file$3, 45, 8, 3075);
    			attr_dev(div30, "class", "demo-main svelte-1928jh3");
    			add_location(div30, file$3, 44, 4, 3042);
    			attr_dev(div31, "class", "dot svelte-1928jh3");
    			add_location(div31, file$3, 66, 16, 4271);
    			attr_dev(div32, "class", "line svelte-1928jh3");
    			add_location(div32, file$3, 67, 16, 4312);
    			attr_dev(div33, "class", "line-container svelte-1928jh3");
    			add_location(div33, file$3, 65, 12, 4225);
    			attr_dev(div34, "class", "cargo svelte-1928jh3");
    			add_location(div34, file$3, 70, 16, 4416);
    			attr_dev(div35, "class", "tiempo svelte-1928jh3");
    			add_location(div35, file$3, 71, 16, 4502);
    			attr_dev(div36, "class", "exp-description svelte-1928jh3");
    			add_location(div36, file$3, 72, 16, 4574);
    			attr_dev(div37, "class", "text-container svelte-1928jh3");
    			add_location(div37, file$3, 69, 12, 4370);
    			attr_dev(div38, "class", "demo1 svelte-1928jh3");
    			add_location(div38, file$3, 64, 8, 4192);
    			attr_dev(div39, "class", "demo-main svelte-1928jh3");
    			add_location(div39, file$3, 63, 4, 4159);
    			attr_dev(div40, "class", "dot svelte-1928jh3");
    			add_location(div40, file$3, 83, 16, 5194);
    			attr_dev(div41, "class", "line2 svelte-1928jh3");
    			add_location(div41, file$3, 84, 16, 5235);
    			attr_dev(div42, "class", "line-container svelte-1928jh3");
    			add_location(div42, file$3, 82, 12, 5148);
    			attr_dev(div43, "class", "cargo svelte-1928jh3");
    			add_location(div43, file$3, 87, 16, 5340);
    			attr_dev(div44, "class", "tiempo svelte-1928jh3");
    			add_location(div44, file$3, 88, 16, 5460);
    			attr_dev(div45, "class", "exp-description svelte-1928jh3");
    			add_location(div45, file$3, 89, 16, 5532);
    			attr_dev(div46, "class", "text-container svelte-1928jh3");
    			add_location(div46, file$3, 86, 12, 5294);
    			attr_dev(div47, "class", "demo1 svelte-1928jh3");
    			add_location(div47, file$3, 81, 8, 5115);
    			attr_dev(div48, "class", "demo-main svelte-1928jh3");
    			add_location(div48, file$3, 80, 4, 5082);
    			attr_dev(div49, "class", "title-exp svelte-1928jh3");
    			add_location(div49, file$3, 97, 4, 6057);
    			attr_dev(div50, "class", "dot svelte-1928jh3");
    			add_location(div50, file$3, 101, 16, 6213);
    			attr_dev(div51, "class", "line svelte-1928jh3");
    			add_location(div51, file$3, 102, 16, 6254);
    			attr_dev(div52, "class", "line-container svelte-1928jh3");
    			add_location(div52, file$3, 100, 12, 6167);
    			attr_dev(div53, "class", "cargo svelte-1928jh3");
    			add_location(div53, file$3, 105, 16, 6358);
    			attr_dev(div54, "class", "exp-description svelte-1928jh3");
    			add_location(div54, file$3, 106, 16, 6415);
    			attr_dev(div55, "class", "text-container svelte-1928jh3");
    			add_location(div55, file$3, 104, 12, 6312);
    			attr_dev(div56, "class", "demo1 svelte-1928jh3");
    			add_location(div56, file$3, 99, 8, 6134);
    			attr_dev(div57, "class", "demo-main svelte-1928jh3");
    			add_location(div57, file$3, 98, 4, 6101);
    			attr_dev(div58, "class", "dot svelte-1928jh3");
    			add_location(div58, file$3, 113, 16, 6656);
    			attr_dev(div59, "class", "line svelte-1928jh3");
    			add_location(div59, file$3, 114, 16, 6697);
    			attr_dev(div60, "class", "line-container svelte-1928jh3");
    			add_location(div60, file$3, 112, 12, 6610);
    			attr_dev(div61, "class", "cargo svelte-1928jh3");
    			add_location(div61, file$3, 117, 16, 6801);
    			attr_dev(div62, "class", "exp-description svelte-1928jh3");
    			add_location(div62, file$3, 118, 16, 6875);
    			attr_dev(div63, "class", "text-container svelte-1928jh3");
    			add_location(div63, file$3, 116, 12, 6755);
    			attr_dev(div64, "class", "demo1 svelte-1928jh3");
    			add_location(div64, file$3, 111, 8, 6577);
    			attr_dev(div65, "class", "demo-main svelte-1928jh3");
    			add_location(div65, file$3, 110, 4, 6544);
    			attr_dev(div66, "class", "dot svelte-1928jh3");
    			add_location(div66, file$3, 126, 16, 7118);
    			attr_dev(div67, "class", "line2 svelte-1928jh3");
    			add_location(div67, file$3, 127, 16, 7159);
    			attr_dev(div68, "class", "line-container svelte-1928jh3");
    			add_location(div68, file$3, 125, 12, 7072);
    			attr_dev(div69, "class", "cargo svelte-1928jh3");
    			add_location(div69, file$3, 130, 16, 7264);
    			attr_dev(div70, "class", "exp-description svelte-1928jh3");
    			add_location(div70, file$3, 131, 16, 7341);
    			attr_dev(div71, "class", "text-container svelte-1928jh3");
    			add_location(div71, file$3, 129, 12, 7218);
    			attr_dev(div72, "class", "demo1 svelte-1928jh3");
    			add_location(div72, file$3, 124, 8, 7039);
    			attr_dev(div73, "class", "demo-main svelte-1928jh3");
    			add_location(div73, file$3, 122, 4, 7004);
    			attr_dev(div74, "class", "perfil svelte-1928jh3");
    			add_location(div74, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div74, anchor);
    			append_dev(div74, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div1, br0);
    			append_dev(div1, t3);
    			append_dev(div1, br1);
    			append_dev(div1, t4);
    			append_dev(div74, t5);
    			append_dev(div74, div3);
    			append_dev(div74, t7);
    			append_dev(div74, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div11, t9);
    			append_dev(div11, div10);
    			append_dev(div10, div7);
    			append_dev(div10, t11);
    			append_dev(div10, div8);
    			append_dev(div10, t13);
    			append_dev(div10, div9);
    			append_dev(div74, t15);
    			append_dev(div74, div21);
    			append_dev(div21, div20);
    			append_dev(div20, div15);
    			append_dev(div15, div13);
    			append_dev(div15, t16);
    			append_dev(div15, div14);
    			append_dev(div20, t17);
    			append_dev(div20, div19);
    			append_dev(div19, div16);
    			append_dev(div19, t19);
    			append_dev(div19, div17);
    			append_dev(div19, t21);
    			append_dev(div19, div18);
    			append_dev(div74, t23);
    			append_dev(div74, div30);
    			append_dev(div30, div29);
    			append_dev(div29, div24);
    			append_dev(div24, div22);
    			append_dev(div24, t24);
    			append_dev(div24, div23);
    			append_dev(div29, t25);
    			append_dev(div29, div28);
    			append_dev(div28, div25);
    			append_dev(div28, t27);
    			append_dev(div28, div26);
    			append_dev(div28, t29);
    			append_dev(div28, div27);
    			append_dev(div27, t30);
    			append_dev(div27, br2);
    			append_dev(div27, t31);
    			append_dev(div27, a);
    			append_dev(div74, t33);
    			append_dev(div74, div39);
    			append_dev(div39, div38);
    			append_dev(div38, div33);
    			append_dev(div33, div31);
    			append_dev(div33, t34);
    			append_dev(div33, div32);
    			append_dev(div38, t35);
    			append_dev(div38, div37);
    			append_dev(div37, div34);
    			append_dev(div37, t37);
    			append_dev(div37, div35);
    			append_dev(div37, t39);
    			append_dev(div37, div36);
    			append_dev(div74, t41);
    			append_dev(div74, div48);
    			append_dev(div48, div47);
    			append_dev(div47, div42);
    			append_dev(div42, div40);
    			append_dev(div42, t42);
    			append_dev(div42, div41);
    			append_dev(div47, t43);
    			append_dev(div47, div46);
    			append_dev(div46, div43);
    			append_dev(div46, t45);
    			append_dev(div46, div44);
    			append_dev(div46, t47);
    			append_dev(div46, div45);
    			append_dev(div74, t49);
    			append_dev(div74, div49);
    			append_dev(div74, t51);
    			append_dev(div74, div57);
    			append_dev(div57, div56);
    			append_dev(div56, div52);
    			append_dev(div52, div50);
    			append_dev(div52, t52);
    			append_dev(div52, div51);
    			append_dev(div56, t53);
    			append_dev(div56, div55);
    			append_dev(div55, div53);
    			append_dev(div55, t55);
    			append_dev(div55, div54);
    			append_dev(div74, t57);
    			append_dev(div74, div65);
    			append_dev(div65, div64);
    			append_dev(div64, div60);
    			append_dev(div60, div58);
    			append_dev(div60, t58);
    			append_dev(div60, div59);
    			append_dev(div64, t59);
    			append_dev(div64, div63);
    			append_dev(div63, div61);
    			append_dev(div63, t61);
    			append_dev(div63, div62);
    			append_dev(div74, t63);
    			append_dev(div74, div73);
    			append_dev(div73, div72);
    			append_dev(div72, div68);
    			append_dev(div68, div66);
    			append_dev(div68, t64);
    			append_dev(div68, div67);
    			append_dev(div72, t65);
    			append_dev(div72, div71);
    			append_dev(div71, div69);
    			append_dev(div71, t67);
    			append_dev(div71, div70);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div74);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sobre_mi', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sobre_mi> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Sobre_mi extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sobre_mi",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\pages\Contactame.svelte generated by Svelte v3.55.0 */

    const file$2 = "src\\pages\\Contactame.svelte";

    function create_fragment$3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Contactame uwu";
    			add_location(h1, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contactame', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contactame> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contactame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contactame",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\Footer.svelte generated by Svelte v3.55.0 */

    const file$1 = "src\\pages\\Footer.svelte";

    function create_fragment$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "© 2022 Erick Mamani";
    			attr_dev(div, "class", "footer svelte-36fva5");
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Sidebar.svelte generated by Svelte v3.55.0 */
    const file = "src\\Sidebar.svelte";

    // (58:34) <Link to='/'>
    function create_default_slot_9(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Inicio";
    			attr_dev(p, "class", "svelte-s3hkwn");
    			add_location(p, file, 57, 47, 2302);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(58:34) <Link to='/'>",
    		ctx
    	});

    	return block;
    }

    // (59:34) <Link to='/Sobre_mi'>
    function create_default_slot_8(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Sobre mi";
    			attr_dev(p, "class", "svelte-s3hkwn");
    			add_location(p, file, 58, 55, 2385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(59:34) <Link to='/Sobre_mi'>",
    		ctx
    	});

    	return block;
    }

    // (60:34) <Link to='/Skills'>
    function create_default_slot_7(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Skills";
    			attr_dev(p, "class", "svelte-s3hkwn");
    			add_location(p, file, 59, 53, 2468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(60:34) <Link to='/Skills'>",
    		ctx
    	});

    	return block;
    }

    // (61:34) <Link to='/Proyectos'>
    function create_default_slot_6(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Proyectos";
    			attr_dev(p, "class", "svelte-s3hkwn");
    			add_location(p, file, 60, 56, 2552);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(61:34) <Link to='/Proyectos'>",
    		ctx
    	});

    	return block;
    }

    // (92:4) <Route path='/'>
    function create_default_slot_5(ctx) {
    	let home1;
    	let t;
    	let lastprojects;
    	let current;
    	home1 = new Home1({ $$inline: true });
    	lastprojects = new LastProjects({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home1.$$.fragment);
    			t = space();
    			create_component(lastprojects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home1, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(lastprojects, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home1.$$.fragment, local);
    			transition_in(lastprojects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home1.$$.fragment, local);
    			transition_out(lastprojects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(lastprojects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(92:4) <Route path='/'>",
    		ctx
    	});

    	return block;
    }

    // (98:4) <Route path='Proyectos'>
    function create_default_slot_4(ctx) {
    	let proyectos;
    	let current;
    	proyectos = new Proyectos({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(proyectos.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(proyectos, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(proyectos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(proyectos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(proyectos, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(98:4) <Route path='Proyectos'>",
    		ctx
    	});

    	return block;
    }

    // (102:4) <Route path='Skills'>
    function create_default_slot_3(ctx) {
    	let skills;
    	let current;
    	skills = new Skills({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(skills.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skills, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skills.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skills.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skills, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(102:4) <Route path='Skills'>",
    		ctx
    	});

    	return block;
    }

    // (106:4) <Route path='Sobre_mi'>
    function create_default_slot_2(ctx) {
    	let sobre_mi;
    	let current;
    	sobre_mi = new Sobre_mi({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sobre_mi.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sobre_mi, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sobre_mi.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sobre_mi.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sobre_mi, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(106:4) <Route path='Sobre_mi'>",
    		ctx
    	});

    	return block;
    }

    // (110:4) <Route path='Contactame'>
    function create_default_slot_1(ctx) {
    	let contactame;
    	let current;
    	contactame = new Contactame({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contactame.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contactame, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactame.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contactame.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contactame, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(110:4) <Route path='Contactame'>",
    		ctx
    	});

    	return block;
    }

    // (49:0) <Router>
    function create_default_slot(ctx) {
    	let div9;
    	let div7;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div6;
    	let div1;
    	let link0;
    	let t1;
    	let div2;
    	let link1;
    	let t2;
    	let div3;
    	let link2;
    	let t3;
    	let div4;
    	let link3;
    	let t4;
    	let div5;
    	let p;
    	let t6;
    	let div8;
    	let a0;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let a1;
    	let img2;
    	let img2_src_value;
    	let t8;
    	let a2;
    	let img3;
    	let img3_src_value;
    	let t9;
    	let a3;
    	let img4;
    	let img4_src_value;
    	let t10;
    	let div10;
    	let t11;
    	let div11;
    	let button0;
    	let img5;
    	let img5_src_value;
    	let t12;
    	let div12;
    	let button1;
    	let img6;
    	let img6_src_value;
    	let t13;
    	let route0;
    	let t14;
    	let route1;
    	let t15;
    	let route2;
    	let t16;
    	let route3;
    	let t17;
    	let route4;
    	let t18;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/Sobre_mi",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "/Skills",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link({
    			props: {
    				to: "/Proyectos",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "Proyectos",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "Skills",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "Sobre_mi",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "Contactame",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div7 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div6 = element("div");
    			div1 = element("div");
    			create_component(link0.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			create_component(link1.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(link2.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			create_component(link3.$$.fragment);
    			t4 = space();
    			div5 = element("div");
    			p = element("p");
    			p.textContent = "Contactame";
    			t6 = space();
    			div8 = element("div");
    			a0 = element("a");
    			img1 = element("img");
    			t7 = space();
    			a1 = element("a");
    			img2 = element("img");
    			t8 = space();
    			a2 = element("a");
    			img3 = element("img");
    			t9 = space();
    			a3 = element("a");
    			img4 = element("img");
    			t10 = space();
    			div10 = element("div");
    			t11 = space();
    			div11 = element("div");
    			button0 = element("button");
    			img5 = element("img");
    			t12 = space();
    			div12 = element("div");
    			button1 = element("button");
    			img6 = element("img");
    			t13 = space();
    			create_component(route0.$$.fragment);
    			t14 = space();
    			create_component(route1.$$.fragment);
    			t15 = space();
    			create_component(route2.$$.fragment);
    			t16 = space();
    			create_component(route3.$$.fragment);
    			t17 = space();
    			create_component(route4.$$.fragment);
    			t18 = space();
    			create_component(footer.$$.fragment);
    			if (!src_url_equal(img0.src, img0_src_value = "./images/foto-perfil.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-s3hkwn");
    			add_location(img0, file, 53, 16, 2098);
    			attr_dev(div0, "class", "foto-perfil svelte-s3hkwn");
    			add_location(div0, file, 52, 12, 2055);
    			attr_dev(div1, "class", "link svelte-s3hkwn");
    			add_location(div1, file, 57, 16, 2271);
    			attr_dev(div2, "class", "link svelte-s3hkwn");
    			add_location(div2, file, 58, 16, 2346);
    			attr_dev(div3, "class", "link svelte-s3hkwn");
    			add_location(div3, file, 59, 16, 2431);
    			attr_dev(div4, "class", "link svelte-s3hkwn");
    			add_location(div4, file, 60, 16, 2512);
    			attr_dev(p, "class", "svelte-s3hkwn");
    			add_location(p, file, 61, 34, 2617);
    			attr_dev(div5, "class", "link svelte-s3hkwn");
    			add_location(div5, file, 61, 16, 2599);
    			attr_dev(div6, "class", "description svelte-s3hkwn");
    			add_location(div6, file, 56, 12, 2228);
    			attr_dev(div7, "class", "top-side");
    			add_location(div7, file, 51, 8, 2019);
    			if (!src_url_equal(img1.src, img1_src_value = "./images/github-" + /*colorTheme*/ ctx[0] + ".svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "github-logo");
    			attr_dev(img1, "class", "svelte-s3hkwn");
    			add_location(img1, file, 66, 16, 2831);
    			attr_dev(a0, "href", "https://github.com/khorneflakes-dev");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener noreferrer");
    			add_location(a0, file, 65, 12, 2725);
    			if (!src_url_equal(img2.src, img2_src_value = "./images/linkedin-" + /*colorTheme*/ ctx[0] + ".svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "linkedin-logo");
    			attr_dev(img2, "class", "svelte-s3hkwn");
    			add_location(img2, file, 69, 16, 3037);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/khorneflakes/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener noreferrer");
    			add_location(a1, file, 68, 12, 2925);
    			if (!src_url_equal(img3.src, img3_src_value = "./images/whatsapp-" + /*colorTheme*/ ctx[0] + ".svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "whatsapp-logo");
    			attr_dev(img3, "class", "svelte-s3hkwn");
    			add_location(img3, file, 72, 16, 3231);
    			attr_dev(a2, "href", "https://wa.me/59169839682");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener noreferrer");
    			add_location(a2, file, 71, 12, 3135);
    			if (!src_url_equal(img4.src, img4_src_value = "./images/telegram-" + /*colorTheme*/ ctx[0] + ".svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "telegram-logo");
    			attr_dev(img4, "class", "svelte-s3hkwn");
    			add_location(img4, file, 75, 16, 3428);
    			attr_dev(a3, "href", "https://t.me/khorneflakesdev");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener noreferrer");
    			add_location(a3, file, 74, 12, 3329);
    			attr_dev(div8, "class", "bottom-side svelte-s3hkwn");
    			add_location(div8, file, 64, 8, 2686);
    			attr_dev(div9, "class", "sidebar svelte-s3hkwn");
    			attr_dev(div9, "id", "sidebar");
    			add_location(div9, file, 50, 4, 1975);
    			attr_dev(div10, "class", "navbar svelte-s3hkwn");
    			add_location(div10, file, 79, 4, 3546);
    			if (!src_url_equal(img5.src, img5_src_value = "./images/theme/" + /*colorTheme*/ ctx[0] + ".svg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "");
    			attr_dev(img5, "class", "svelte-s3hkwn");
    			add_location(img5, file, 82, 12, 3667);
    			attr_dev(button0, "class", "button-theme svelte-s3hkwn");
    			add_location(button0, file, 81, 8, 3607);
    			attr_dev(div11, "class", "theme svelte-s3hkwn");
    			add_location(div11, file, 80, 4, 3578);
    			if (!src_url_equal(img6.src, img6_src_value = "./images/burger" + /*colorTheme*/ ctx[0] + ".svg")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "");
    			attr_dev(img6, "class", "svelte-s3hkwn");
    			add_location(img6, file, 87, 12, 3853);
    			attr_dev(button1, "class", "burger-button svelte-s3hkwn");
    			add_location(button1, file, 86, 8, 3791);
    			attr_dev(div12, "class", "slider-button svelte-s3hkwn");
    			add_location(div12, file, 85, 4, 3754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div7);
    			append_dev(div7, div0);
    			append_dev(div0, img0);
    			append_dev(div7, t0);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			mount_component(link0, div1, null);
    			append_dev(div6, t1);
    			append_dev(div6, div2);
    			mount_component(link1, div2, null);
    			append_dev(div6, t2);
    			append_dev(div6, div3);
    			mount_component(link2, div3, null);
    			append_dev(div6, t3);
    			append_dev(div6, div4);
    			mount_component(link3, div4, null);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, p);
    			append_dev(div9, t6);
    			append_dev(div9, div8);
    			append_dev(div8, a0);
    			append_dev(a0, img1);
    			append_dev(div8, t7);
    			append_dev(div8, a1);
    			append_dev(a1, img2);
    			append_dev(div8, t8);
    			append_dev(div8, a2);
    			append_dev(a2, img3);
    			append_dev(div8, t9);
    			append_dev(div8, a3);
    			append_dev(a3, img4);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div10, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, button0);
    			append_dev(button0, img5);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div12, anchor);
    			append_dev(div12, button1);
    			append_dev(button1, img6);
    			insert_dev(target, t13, anchor);
    			mount_component(route0, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(route3, target, anchor);
    			insert_dev(target, t17, anchor);
    			mount_component(route4, target, anchor);
    			insert_dev(target, t18, anchor);
    			mount_component(footer, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*theme*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*burger*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);

    			if (!current || dirty & /*colorTheme*/ 1 && !src_url_equal(img1.src, img1_src_value = "./images/github-" + /*colorTheme*/ ctx[0] + ".svg")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (!current || dirty & /*colorTheme*/ 1 && !src_url_equal(img2.src, img2_src_value = "./images/linkedin-" + /*colorTheme*/ ctx[0] + ".svg")) {
    				attr_dev(img2, "src", img2_src_value);
    			}

    			if (!current || dirty & /*colorTheme*/ 1 && !src_url_equal(img3.src, img3_src_value = "./images/whatsapp-" + /*colorTheme*/ ctx[0] + ".svg")) {
    				attr_dev(img3, "src", img3_src_value);
    			}

    			if (!current || dirty & /*colorTheme*/ 1 && !src_url_equal(img4.src, img4_src_value = "./images/telegram-" + /*colorTheme*/ ctx[0] + ".svg")) {
    				attr_dev(img4, "src", img4_src_value);
    			}

    			if (!current || dirty & /*colorTheme*/ 1 && !src_url_equal(img5.src, img5_src_value = "./images/theme/" + /*colorTheme*/ ctx[0] + ".svg")) {
    				attr_dev(img5, "src", img5_src_value);
    			}

    			if (!current || dirty & /*colorTheme*/ 1 && !src_url_equal(img6.src, img6_src_value = "./images/burger" + /*colorTheme*/ ctx[0] + ".svg")) {
    				attr_dev(img6, "src", img6_src_value);
    			}

    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div10);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div11);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div12);
    			if (detaching) detach_dev(t13);
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(route3, detaching);
    			if (detaching) detach_dev(t17);
    			destroy_component(route4, detaching);
    			if (detaching) detach_dev(t18);
    			destroy_component(footer, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(49:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, colorTheme*/ 17) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sidebar', slots, []);
    	let colorTheme = 'day';

    	function theme() {
    		if (colorTheme == 'day') {
    			document.documentElement.style.setProperty('--color-texto', 'white');
    			document.documentElement.style.setProperty('--color-principal', '#303030');
    			document.documentElement.style.setProperty('--color-secundario', '#343434');
    			document.documentElement.style.setProperty('--color-shadow', '#ffffff86');
    			document.documentElement.style.setProperty('--line-color', '#ffa705');
    			$$invalidate(0, colorTheme = 'night');
    		} else if (colorTheme == 'night') {
    			document.documentElement.style.setProperty('--color-texto', '#303030');
    			document.documentElement.style.setProperty('--color-principal', 'white');
    			document.documentElement.style.setProperty('--color-secundario', '#d9d9d9');
    			document.documentElement.style.setProperty('--color-shadow', '#3a3a3a41');
    			document.documentElement.style.setProperty('--line-color', '#5425d6');
    			$$invalidate(0, colorTheme = 'day');
    		}
    	}

    	let translatex = 0;

    	function burger() {
    		const div = document.getElementById('sidebar');

    		if (translatex == 100) {
    			div.style.transform = 'translateX(-100%)';
    			translatex = 0;
    		} else if (translatex == 0) {
    			div.style.transform = 'translateX(0%)';
    			translatex = 100;
    		}

    		requestAnimationFrame(animarDiv);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Link,
    		Route,
    		Home1,
    		LastProjects,
    		Proyectos,
    		Skills,
    		Sobre_mi,
    		Contactame,
    		Footer,
    		colorTheme,
    		theme,
    		translatex,
    		burger
    	});

    	$$self.$inject_state = $$props => {
    		if ('colorTheme' in $$props) $$invalidate(0, colorTheme = $$props.colorTheme);
    		if ('translatex' in $$props) translatex = $$props.translatex;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colorTheme, theme, burger];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.55.0 */

    function create_fragment(ctx) {
    	let sidebar;
    	let current;
    	sidebar = new Sidebar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sidebar.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Sidebar });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,

    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
