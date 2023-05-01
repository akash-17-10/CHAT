
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$1() {
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
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
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
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
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
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
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

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
            flush_render_callbacks($$.after_update);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.58.0' }, detail), { bubbles: true }));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
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
                if (subscribers.size === 0 && stop) {
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
            let started = false;
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
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
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
    function pick$1(routes, uri) {
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
      return pick$1([route], uri);
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

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.58.0 */

    function create_fragment$g(ctx) {
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		pick: pick$1,
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
    				const bestMatch = pick$1($routes, $location.pathname);
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$g.name
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

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.58.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block];
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
    			if_block_anchor = empty$1();
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
    		id: create_if_block$4.name,
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
    function create_if_block_1$3(ctx) {
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
    			switch_instance_anchor = empty$1();
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

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
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
    					if_block = create_if_block$4(ctx);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$f.name
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

    /* node_modules\svelte-icons\components\IconBase.svelte generated by Svelte v3.58.0 */

    const file$d = "node_modules\\svelte-icons\\components\\IconBase.svelte";

    // (18:2) {#if title}
    function create_if_block$3(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[0]);
    			add_location(title_1, file$d, 18, 4, 298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(18:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let svg;
    	let if_block_anchor;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "class", "svelte-c8tyih");
    			add_location(svg, file$d, 16, 0, 229);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, if_block_anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(svg, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
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
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconBase', slots, ['default']);
    	let { title = null } = $$props;
    	let { viewBox } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (viewBox === undefined && !('viewBox' in $$props || $$self.$$.bound[$$self.$$.props['viewBox']])) {
    			console.warn("<IconBase> was created without expected prop 'viewBox'");
    		}
    	});

    	const writable_props = ['title', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconBase> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, viewBox, $$scope, slots];
    }

    class IconBase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { title: 0, viewBox: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconBase",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get title() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-icons\gi\GiPerspectiveDiceSixFacesTwo.svelte generated by Svelte v3.58.0 */
    const file$c = "node_modules\\svelte-icons\\gi\\GiPerspectiveDiceSixFacesTwo.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$4(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M255.75 44.813c-6.187 0-12.75 1.563-17.125 4.093L85.875 137.28c-4.375 2.532-7.094 6.33-7.094 9.907 0 3.58 2.69 7.376 7.064 9.907l152.78 88.375c4.376 2.53 10.94 4.093 17.126 4.093 6.187 0 12.782-1.564 17.156-4.094l152.75-88.376c4.375-2.53 7.094-6.328 7.094-9.906 0-3.58-2.75-7.376-7.125-9.907l-152.75-88.374c-4.375-2.53-10.938-4.094-17.125-4.093zm0 12.343a31.953 18.96 0 0 1 23.063 5.563 31.953 18.96 0 0 1-45.188 26.81 31.953 18.96 0 0 1 20.813-32.343 31.953 18.96 0 0 1 1.312-.03zM75.07 173.95c-1.497.048-2.873.402-4.033 1.07-3.094 1.787-5.033 6.043-5.033 11.095v157.688c0 5.052 1.94 11.547 5.033 16.906 3.094 5.358 7.723 10.27 12.098 12.796l146.945 84.857c4.375 2.527 9.03 2.974 12.123 1.188 3.094-1.785 5.008-6.056 5.008-11.11V290.755c0-5.052-1.913-11.532-5.007-16.89-3.094-5.36-7.748-10.255-12.123-12.782L83.135 176.225c-2.735-1.58-5.57-2.352-8.065-2.274zm361.97.017c-2.504-.083-5.348.684-8.083 2.263L282.04 261.07c-4.376 2.527-9.03 7.456-12.124 12.815l-.082.14c-3.047 5.332-4.926 11.71-4.926 16.72v157.718c0 5.052 1.914 9.323 5.008 11.11 3.094 1.785 7.748 1.305 12.123-1.22l146.917-84.84c4.375-2.528 9.03-7.423 12.125-12.783 3.094-5.36 5.033-11.853 5.033-16.906v-157.72c0-5.05-1.94-9.275-5.033-11.06-1.16-.67-2.54-1.028-4.043-1.077zm-14.222 21.803A18.008 31.236 31.906 0 1 434 210.973a18.008 31.236 31.906 0 1-45 25.98 18.008 31.236 31.906 0 1 33.818-41.183zm-167.068 2.292a31.953 18.96 0 0 1 23.063 5.563 31.953 18.96 0 0 1-45.188 26.813 31.953 18.96 0 0 1 20.813-32.344 31.953 18.96 0 0 1 1.312-.03zM145.295 289.1a31.236 18.008 58.094 0 1 33.818 41.183 31.236 18.008 58.094 0 1-45-25.98 31.236 18.008 58.094 0 1 11.182-15.203zm221.525 0a18.008 31.236 31.906 0 1 .002 0 18.008 31.236 31.906 0 1 11.18 15.203 18.008 31.236 31.906 0 1-45 25.98A18.008 31.236 31.906 0 1 366.82 289.1zm-56.002 94.043A18.008 31.236 31.906 0 1 322 398.346a18.008 31.236 31.906 0 1-45 25.98 18.008 31.236 31.906 0 1 33.818-41.183z");
    			add_location(path, file$c, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GiPerspectiveDiceSixFacesTwo', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class GiPerspectiveDiceSixFacesTwo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GiPerspectiveDiceSixFacesTwo",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    // source: https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases
    // license; UNLICENSED
    var eff = {
        11111: "abacus",
        11112: "abdomen",
        11113: "abdominal",
        11114: "abide",
        11115: "abiding",
        11116: "ability",
        11121: "ablaze",
        11122: "able",
        11123: "abnormal",
        11124: "abrasion",
        11125: "abrasive",
        11126: "abreast",
        11131: "abridge",
        11132: "abroad",
        11133: "abruptly",
        11134: "absence",
        11135: "absentee",
        11136: "absently",
        11141: "absinthe",
        11142: "absolute",
        11143: "absolve",
        11144: "abstain",
        11145: "abstract",
        11146: "absurd",
        11151: "accent",
        11152: "acclaim",
        11153: "acclimate",
        11154: "accompany",
        11155: "account",
        11156: "accuracy",
        11161: "accurate",
        11162: "accustom",
        11163: "acetone",
        11164: "achiness",
        11165: "aching",
        11166: "acid",
        11211: "acorn",
        11212: "acquaint",
        11213: "acquire",
        11214: "acre",
        11215: "acrobat",
        11216: "acronym",
        11221: "acting",
        11222: "action",
        11223: "activate",
        11224: "activator",
        11225: "active",
        11226: "activism",
        11231: "activist",
        11232: "activity",
        11233: "actress",
        11234: "acts",
        11235: "acutely",
        11236: "acuteness",
        11241: "aeration",
        11242: "aerobics",
        11243: "aerosol",
        11244: "aerospace",
        11245: "afar",
        11246: "affair",
        11251: "affected",
        11252: "affecting",
        11253: "affection",
        11254: "affidavit",
        11255: "affiliate",
        11256: "affirm",
        11261: "affix",
        11262: "afflicted",
        11263: "affluent",
        11264: "afford",
        11265: "affront",
        11266: "aflame",
        11311: "afloat",
        11312: "aflutter",
        11313: "afoot",
        11314: "afraid",
        11315: "afterglow",
        11316: "afterlife",
        11321: "aftermath",
        11322: "aftermost",
        11323: "afternoon",
        11324: "aged",
        11325: "ageless",
        11326: "agency",
        11331: "agenda",
        11332: "agent",
        11333: "aggregate",
        11334: "aghast",
        11335: "agile",
        11336: "agility",
        11341: "aging",
        11342: "agnostic",
        11343: "agonize",
        11344: "agonizing",
        11345: "agony",
        11346: "agreeable",
        11351: "agreeably",
        11352: "agreed",
        11353: "agreeing",
        11354: "agreement",
        11355: "aground",
        11356: "ahead",
        11361: "ahoy",
        11362: "aide",
        11363: "aids",
        11364: "aim",
        11365: "ajar",
        11366: "alabaster",
        11411: "alarm",
        11412: "albatross",
        11413: "album",
        11414: "alfalfa",
        11415: "algebra",
        11416: "algorithm",
        11421: "alias",
        11422: "alibi",
        11423: "alienable",
        11424: "alienate",
        11425: "aliens",
        11426: "alike",
        11431: "alive",
        11432: "alkaline",
        11433: "alkalize",
        11434: "almanac",
        11435: "almighty",
        11436: "almost",
        11441: "aloe",
        11442: "aloft",
        11443: "aloha",
        11444: "alone",
        11445: "alongside",
        11446: "aloof",
        11451: "alphabet",
        11452: "alright",
        11453: "although",
        11454: "altitude",
        11455: "alto",
        11456: "aluminum",
        11461: "alumni",
        11462: "always",
        11463: "amaretto",
        11464: "amaze",
        11465: "amazingly",
        11466: "amber",
        11511: "ambiance",
        11512: "ambiguity",
        11513: "ambiguous",
        11514: "ambition",
        11515: "ambitious",
        11516: "ambulance",
        11521: "ambush",
        11522: "amendable",
        11523: "amendment",
        11524: "amends",
        11525: "amenity",
        11526: "amiable",
        11531: "amicably",
        11532: "amid",
        11533: "amigo",
        11534: "amino",
        11535: "amiss",
        11536: "ammonia",
        11541: "ammonium",
        11542: "amnesty",
        11543: "amniotic",
        11544: "among",
        11545: "amount",
        11546: "amperage",
        11551: "ample",
        11552: "amplifier",
        11553: "amplify",
        11554: "amply",
        11555: "amuck",
        11556: "amulet",
        11561: "amusable",
        11562: "amused",
        11563: "amusement",
        11564: "amuser",
        11565: "amusing",
        11566: "anaconda",
        11611: "anaerobic",
        11612: "anagram",
        11613: "anatomist",
        11614: "anatomy",
        11615: "anchor",
        11616: "anchovy",
        11621: "ancient",
        11622: "android",
        11623: "anemia",
        11624: "anemic",
        11625: "aneurism",
        11626: "anew",
        11631: "angelfish",
        11632: "angelic",
        11633: "anger",
        11634: "angled",
        11635: "angler",
        11636: "angles",
        11641: "angling",
        11642: "angrily",
        11643: "angriness",
        11644: "anguished",
        11645: "angular",
        11646: "animal",
        11651: "animate",
        11652: "animating",
        11653: "animation",
        11654: "animator",
        11655: "anime",
        11656: "animosity",
        11661: "ankle",
        11662: "annex",
        11663: "annotate",
        11664: "announcer",
        11665: "annoying",
        11666: "annually",
        12111: "annuity",
        12112: "anointer",
        12113: "another",
        12114: "answering",
        12115: "antacid",
        12116: "antarctic",
        12121: "anteater",
        12122: "antelope",
        12123: "antennae",
        12124: "anthem",
        12125: "anthill",
        12126: "anthology",
        12131: "antibody",
        12132: "antics",
        12133: "antidote",
        12134: "antihero",
        12135: "antiquely",
        12136: "antiques",
        12141: "antiquity",
        12142: "antirust",
        12143: "antitoxic",
        12144: "antitrust",
        12145: "antiviral",
        12146: "antivirus",
        12151: "antler",
        12152: "antonym",
        12153: "antsy",
        12154: "anvil",
        12155: "anybody",
        12156: "anyhow",
        12161: "anymore",
        12162: "anyone",
        12163: "anyplace",
        12164: "anything",
        12165: "anytime",
        12166: "anyway",
        12211: "anywhere",
        12212: "aorta",
        12213: "apache",
        12214: "apostle",
        12215: "appealing",
        12216: "appear",
        12221: "appease",
        12222: "appeasing",
        12223: "appendage",
        12224: "appendix",
        12225: "appetite",
        12226: "appetizer",
        12231: "applaud",
        12232: "applause",
        12233: "apple",
        12234: "appliance",
        12235: "applicant",
        12236: "applied",
        12241: "apply",
        12242: "appointee",
        12243: "appraisal",
        12244: "appraiser",
        12245: "apprehend",
        12246: "approach",
        12251: "approval",
        12252: "approve",
        12253: "apricot",
        12254: "april",
        12255: "apron",
        12256: "aptitude",
        12261: "aptly",
        12262: "aqua",
        12263: "aqueduct",
        12264: "arbitrary",
        12265: "arbitrate",
        12266: "ardently",
        12311: "area",
        12312: "arena",
        12313: "arguable",
        12314: "arguably",
        12315: "argue",
        12316: "arise",
        12321: "armadillo",
        12322: "armband",
        12323: "armchair",
        12324: "armed",
        12325: "armful",
        12326: "armhole",
        12331: "arming",
        12332: "armless",
        12333: "armoire",
        12334: "armored",
        12335: "armory",
        12336: "armrest",
        12341: "army",
        12342: "aroma",
        12343: "arose",
        12344: "around",
        12345: "arousal",
        12346: "arrange",
        12351: "array",
        12352: "arrest",
        12353: "arrival",
        12354: "arrive",
        12355: "arrogance",
        12356: "arrogant",
        12361: "arson",
        12362: "art",
        12363: "ascend",
        12364: "ascension",
        12365: "ascent",
        12366: "ascertain",
        12411: "ashamed",
        12412: "ashen",
        12413: "ashes",
        12414: "ashy",
        12415: "aside",
        12416: "askew",
        12421: "asleep",
        12422: "asparagus",
        12423: "aspect",
        12424: "aspirate",
        12425: "aspire",
        12426: "aspirin",
        12431: "astonish",
        12432: "astound",
        12433: "astride",
        12434: "astrology",
        12435: "astronaut",
        12436: "astronomy",
        12441: "astute",
        12442: "atlantic",
        12443: "atlas",
        12444: "atom",
        12445: "atonable",
        12446: "atop",
        12451: "atrium",
        12452: "atrocious",
        12453: "atrophy",
        12454: "attach",
        12455: "attain",
        12456: "attempt",
        12461: "attendant",
        12462: "attendee",
        12463: "attention",
        12464: "attentive",
        12465: "attest",
        12466: "attic",
        12511: "attire",
        12512: "attitude",
        12513: "attractor",
        12514: "attribute",
        12515: "atypical",
        12516: "auction",
        12521: "audacious",
        12522: "audacity",
        12523: "audible",
        12524: "audibly",
        12525: "audience",
        12526: "audio",
        12531: "audition",
        12532: "augmented",
        12533: "august",
        12534: "authentic",
        12535: "author",
        12536: "autism",
        12541: "autistic",
        12542: "autograph",
        12543: "automaker",
        12544: "automated",
        12545: "automatic",
        12546: "autopilot",
        12551: "available",
        12552: "avalanche",
        12553: "avatar",
        12554: "avenge",
        12555: "avenging",
        12556: "avenue",
        12561: "average",
        12562: "aversion",
        12563: "avert",
        12564: "aviation",
        12565: "aviator",
        12566: "avid",
        12611: "avoid",
        12612: "await",
        12613: "awaken",
        12614: "award",
        12615: "aware",
        12616: "awhile",
        12621: "awkward",
        12622: "awning",
        12623: "awoke",
        12624: "awry",
        12625: "axis",
        12626: "babble",
        12631: "babbling",
        12632: "babied",
        12633: "baboon",
        12634: "backache",
        12635: "backboard",
        12636: "backboned",
        12641: "backdrop",
        12642: "backed",
        12643: "backer",
        12644: "backfield",
        12645: "backfire",
        12646: "backhand",
        12651: "backing",
        12652: "backlands",
        12653: "backlash",
        12654: "backless",
        12655: "backlight",
        12656: "backlit",
        12661: "backlog",
        12662: "backpack",
        12663: "backpedal",
        12664: "backrest",
        12665: "backroom",
        12666: "backshift",
        13111: "backside",
        13112: "backslid",
        13113: "backspace",
        13114: "backspin",
        13115: "backstab",
        13116: "backstage",
        13121: "backtalk",
        13122: "backtrack",
        13123: "backup",
        13124: "backward",
        13125: "backwash",
        13126: "backwater",
        13131: "backyard",
        13132: "bacon",
        13133: "bacteria",
        13134: "bacterium",
        13135: "badass",
        13136: "badge",
        13141: "badland",
        13142: "badly",
        13143: "badness",
        13144: "baffle",
        13145: "baffling",
        13146: "bagel",
        13151: "bagful",
        13152: "baggage",
        13153: "bagged",
        13154: "baggie",
        13155: "bagginess",
        13156: "bagging",
        13161: "baggy",
        13162: "bagpipe",
        13163: "baguette",
        13164: "baked",
        13165: "bakery",
        13166: "bakeshop",
        13211: "baking",
        13212: "balance",
        13213: "balancing",
        13214: "balcony",
        13215: "balmy",
        13216: "balsamic",
        13221: "bamboo",
        13222: "banana",
        13223: "banish",
        13224: "banister",
        13225: "banjo",
        13226: "bankable",
        13231: "bankbook",
        13232: "banked",
        13233: "banker",
        13234: "banking",
        13235: "banknote",
        13236: "bankroll",
        13241: "banner",
        13242: "bannister",
        13243: "banshee",
        13244: "banter",
        13245: "barbecue",
        13246: "barbed",
        13251: "barbell",
        13252: "barber",
        13253: "barcode",
        13254: "barge",
        13255: "bargraph",
        13256: "barista",
        13261: "baritone",
        13262: "barley",
        13263: "barmaid",
        13264: "barman",
        13265: "barn",
        13266: "barometer",
        13311: "barrack",
        13312: "barracuda",
        13313: "barrel",
        13314: "barrette",
        13315: "barricade",
        13316: "barrier",
        13321: "barstool",
        13322: "bartender",
        13323: "barterer",
        13324: "bash",
        13325: "basically",
        13326: "basics",
        13331: "basil",
        13332: "basin",
        13333: "basis",
        13334: "basket",
        13335: "batboy",
        13336: "batch",
        13341: "bath",
        13342: "baton",
        13343: "bats",
        13344: "battalion",
        13345: "battered",
        13346: "battering",
        13351: "battery",
        13352: "batting",
        13353: "battle",
        13354: "bauble",
        13355: "bazooka",
        13356: "blabber",
        13361: "bladder",
        13362: "blade",
        13363: "blah",
        13364: "blame",
        13365: "blaming",
        13366: "blanching",
        13411: "blandness",
        13412: "blank",
        13413: "blaspheme",
        13414: "blasphemy",
        13415: "blast",
        13416: "blatancy",
        13421: "blatantly",
        13422: "blazer",
        13423: "blazing",
        13424: "bleach",
        13425: "bleak",
        13426: "bleep",
        13431: "blemish",
        13432: "blend",
        13433: "bless",
        13434: "blighted",
        13435: "blimp",
        13436: "bling",
        13441: "blinked",
        13442: "blinker",
        13443: "blinking",
        13444: "blinks",
        13445: "blip",
        13446: "blissful",
        13451: "blitz",
        13452: "blizzard",
        13453: "bloated",
        13454: "bloating",
        13455: "blob",
        13456: "blog",
        13461: "bloomers",
        13462: "blooming",
        13463: "blooper",
        13464: "blot",
        13465: "blouse",
        13466: "blubber",
        13511: "bluff",
        13512: "bluish",
        13513: "blunderer",
        13514: "blunt",
        13515: "blurb",
        13516: "blurred",
        13521: "blurry",
        13522: "blurt",
        13523: "blush",
        13524: "blustery",
        13525: "boaster",
        13526: "boastful",
        13531: "boasting",
        13532: "boat",
        13533: "bobbed",
        13534: "bobbing",
        13535: "bobble",
        13536: "bobcat",
        13541: "bobsled",
        13542: "bobtail",
        13543: "bodacious",
        13544: "body",
        13545: "bogged",
        13546: "boggle",
        13551: "bogus",
        13552: "boil",
        13553: "bok",
        13554: "bolster",
        13555: "bolt",
        13556: "bonanza",
        13561: "bonded",
        13562: "bonding",
        13563: "bondless",
        13564: "boned",
        13565: "bonehead",
        13566: "boneless",
        13611: "bonelike",
        13612: "boney",
        13613: "bonfire",
        13614: "bonnet",
        13615: "bonsai",
        13616: "bonus",
        13621: "bony",
        13622: "boogeyman",
        13623: "boogieman",
        13624: "book",
        13625: "boondocks",
        13626: "booted",
        13631: "booth",
        13632: "bootie",
        13633: "booting",
        13634: "bootlace",
        13635: "bootleg",
        13636: "boots",
        13641: "boozy",
        13642: "borax",
        13643: "boring",
        13644: "borough",
        13645: "borrower",
        13646: "borrowing",
        13651: "boss",
        13652: "botanical",
        13653: "botanist",
        13654: "botany",
        13655: "botch",
        13656: "both",
        13661: "bottle",
        13662: "bottling",
        13663: "bottom",
        13664: "bounce",
        13665: "bouncing",
        13666: "bouncy",
        14111: "bounding",
        14112: "boundless",
        14113: "bountiful",
        14114: "bovine",
        14115: "boxcar",
        14116: "boxer",
        14121: "boxing",
        14122: "boxlike",
        14123: "boxy",
        14124: "breach",
        14125: "breath",
        14126: "breeches",
        14131: "breeching",
        14132: "breeder",
        14133: "breeding",
        14134: "breeze",
        14135: "breezy",
        14136: "brethren",
        14141: "brewery",
        14142: "brewing",
        14143: "briar",
        14144: "bribe",
        14145: "brick",
        14146: "bride",
        14151: "bridged",
        14152: "brigade",
        14153: "bright",
        14154: "brilliant",
        14155: "brim",
        14156: "bring",
        14161: "brink",
        14162: "brisket",
        14163: "briskly",
        14164: "briskness",
        14165: "bristle",
        14166: "brittle",
        14211: "broadband",
        14212: "broadcast",
        14213: "broaden",
        14214: "broadly",
        14215: "broadness",
        14216: "broadside",
        14221: "broadways",
        14222: "broiler",
        14223: "broiling",
        14224: "broken",
        14225: "broker",
        14226: "bronchial",
        14231: "bronco",
        14232: "bronze",
        14233: "bronzing",
        14234: "brook",
        14235: "broom",
        14236: "brought",
        14241: "browbeat",
        14242: "brownnose",
        14243: "browse",
        14244: "browsing",
        14245: "bruising",
        14246: "brunch",
        14251: "brunette",
        14252: "brunt",
        14253: "brush",
        14254: "brussels",
        14255: "brute",
        14256: "brutishly",
        14261: "bubble",
        14262: "bubbling",
        14263: "bubbly",
        14264: "buccaneer",
        14265: "bucked",
        14266: "bucket",
        14311: "buckle",
        14312: "buckshot",
        14313: "buckskin",
        14314: "bucktooth",
        14315: "buckwheat",
        14316: "buddhism",
        14321: "buddhist",
        14322: "budding",
        14323: "buddy",
        14324: "budget",
        14325: "buffalo",
        14326: "buffed",
        14331: "buffer",
        14332: "buffing",
        14333: "buffoon",
        14334: "buggy",
        14335: "bulb",
        14336: "bulge",
        14341: "bulginess",
        14342: "bulgur",
        14343: "bulk",
        14344: "bulldog",
        14345: "bulldozer",
        14346: "bullfight",
        14351: "bullfrog",
        14352: "bullhorn",
        14353: "bullion",
        14354: "bullish",
        14355: "bullpen",
        14356: "bullring",
        14361: "bullseye",
        14362: "bullwhip",
        14363: "bully",
        14364: "bunch",
        14365: "bundle",
        14366: "bungee",
        14411: "bunion",
        14412: "bunkbed",
        14413: "bunkhouse",
        14414: "bunkmate",
        14415: "bunny",
        14416: "bunt",
        14421: "busboy",
        14422: "bush",
        14423: "busily",
        14424: "busload",
        14425: "bust",
        14426: "busybody",
        14431: "buzz",
        14432: "cabana",
        14433: "cabbage",
        14434: "cabbie",
        14435: "cabdriver",
        14436: "cable",
        14441: "caboose",
        14442: "cache",
        14443: "cackle",
        14444: "cacti",
        14445: "cactus",
        14446: "caddie",
        14451: "caddy",
        14452: "cadet",
        14453: "cadillac",
        14454: "cadmium",
        14455: "cage",
        14456: "cahoots",
        14461: "cake",
        14462: "calamari",
        14463: "calamity",
        14464: "calcium",
        14465: "calculate",
        14466: "calculus",
        14511: "caliber",
        14512: "calibrate",
        14513: "calm",
        14514: "caloric",
        14515: "calorie",
        14516: "calzone",
        14521: "camcorder",
        14522: "cameo",
        14523: "camera",
        14524: "camisole",
        14525: "camper",
        14526: "campfire",
        14531: "camping",
        14532: "campsite",
        14533: "campus",
        14534: "canal",
        14535: "canary",
        14536: "cancel",
        14541: "candied",
        14542: "candle",
        14543: "candy",
        14544: "cane",
        14545: "canine",
        14546: "canister",
        14551: "cannabis",
        14552: "canned",
        14553: "canning",
        14554: "cannon",
        14555: "cannot",
        14556: "canola",
        14561: "canon",
        14562: "canopener",
        14563: "canopy",
        14564: "canteen",
        14565: "canyon",
        14566: "capable",
        14611: "capably",
        14612: "capacity",
        14613: "cape",
        14614: "capillary",
        14615: "capital",
        14616: "capitol",
        14621: "capped",
        14622: "capricorn",
        14623: "capsize",
        14624: "capsule",
        14625: "caption",
        14626: "captivate",
        14631: "captive",
        14632: "captivity",
        14633: "capture",
        14634: "caramel",
        14635: "carat",
        14636: "caravan",
        14641: "carbon",
        14642: "cardboard",
        14643: "carded",
        14644: "cardiac",
        14645: "cardigan",
        14646: "cardinal",
        14651: "cardstock",
        14652: "carefully",
        14653: "caregiver",
        14654: "careless",
        14655: "caress",
        14656: "caretaker",
        14661: "cargo",
        14662: "caring",
        14663: "carless",
        14664: "carload",
        14665: "carmaker",
        14666: "carnage",
        15111: "carnation",
        15112: "carnival",
        15113: "carnivore",
        15114: "carol",
        15115: "carpenter",
        15116: "carpentry",
        15121: "carpool",
        15122: "carport",
        15123: "carried",
        15124: "carrot",
        15125: "carrousel",
        15126: "carry",
        15131: "cartel",
        15132: "cartload",
        15133: "carton",
        15134: "cartoon",
        15135: "cartridge",
        15136: "cartwheel",
        15141: "carve",
        15142: "carving",
        15143: "carwash",
        15144: "cascade",
        15145: "case",
        15146: "cash",
        15151: "casing",
        15152: "casino",
        15153: "casket",
        15154: "cassette",
        15155: "casually",
        15156: "casualty",
        15161: "catacomb",
        15162: "catalog",
        15163: "catalyst",
        15164: "catalyze",
        15165: "catapult",
        15166: "cataract",
        15211: "catatonic",
        15212: "catcall",
        15213: "catchable",
        15214: "catcher",
        15215: "catching",
        15216: "catchy",
        15221: "caterer",
        15222: "catering",
        15223: "catfight",
        15224: "catfish",
        15225: "cathedral",
        15226: "cathouse",
        15231: "catlike",
        15232: "catnap",
        15233: "catnip",
        15234: "catsup",
        15235: "cattail",
        15236: "cattishly",
        15241: "cattle",
        15242: "catty",
        15243: "catwalk",
        15244: "caucasian",
        15245: "caucus",
        15246: "causal",
        15251: "causation",
        15252: "cause",
        15253: "causing",
        15254: "cauterize",
        15255: "caution",
        15256: "cautious",
        15261: "cavalier",
        15262: "cavalry",
        15263: "caviar",
        15264: "cavity",
        15265: "cedar",
        15266: "celery",
        15311: "celestial",
        15312: "celibacy",
        15313: "celibate",
        15314: "celtic",
        15315: "cement",
        15316: "census",
        15321: "ceramics",
        15322: "ceremony",
        15323: "certainly",
        15324: "certainty",
        15325: "certified",
        15326: "certify",
        15331: "cesarean",
        15332: "cesspool",
        15333: "chafe",
        15334: "chaffing",
        15335: "chain",
        15336: "chair",
        15341: "chalice",
        15342: "challenge",
        15343: "chamber",
        15344: "chamomile",
        15345: "champion",
        15346: "chance",
        15351: "change",
        15352: "channel",
        15353: "chant",
        15354: "chaos",
        15355: "chaperone",
        15356: "chaplain",
        15361: "chapped",
        15362: "chaps",
        15363: "chapter",
        15364: "character",
        15365: "charbroil",
        15366: "charcoal",
        15411: "charger",
        15412: "charging",
        15413: "chariot",
        15414: "charity",
        15415: "charm",
        15416: "charred",
        15421: "charter",
        15422: "charting",
        15423: "chase",
        15424: "chasing",
        15425: "chaste",
        15426: "chastise",
        15431: "chastity",
        15432: "chatroom",
        15433: "chatter",
        15434: "chatting",
        15435: "chatty",
        15436: "cheating",
        15441: "cheddar",
        15442: "cheek",
        15443: "cheer",
        15444: "cheese",
        15445: "cheesy",
        15446: "chef",
        15451: "chemicals",
        15452: "chemist",
        15453: "chemo",
        15454: "cherisher",
        15455: "cherub",
        15456: "chess",
        15461: "chest",
        15462: "chevron",
        15463: "chevy",
        15464: "chewable",
        15465: "chewer",
        15466: "chewing",
        15511: "chewy",
        15512: "chief",
        15513: "chihuahua",
        15514: "childcare",
        15515: "childhood",
        15516: "childish",
        15521: "childless",
        15522: "childlike",
        15523: "chili",
        15524: "chill",
        15525: "chimp",
        15526: "chip",
        15531: "chirping",
        15532: "chirpy",
        15533: "chitchat",
        15534: "chivalry",
        15535: "chive",
        15536: "chloride",
        15541: "chlorine",
        15542: "choice",
        15543: "chokehold",
        15544: "choking",
        15545: "chomp",
        15546: "chooser",
        15551: "choosing",
        15552: "choosy",
        15553: "chop",
        15554: "chosen",
        15555: "chowder",
        15556: "chowtime",
        15561: "chrome",
        15562: "chubby",
        15563: "chuck",
        15564: "chug",
        15565: "chummy",
        15566: "chump",
        15611: "chunk",
        15612: "churn",
        15613: "chute",
        15614: "cider",
        15615: "cilantro",
        15616: "cinch",
        15621: "cinema",
        15622: "cinnamon",
        15623: "circle",
        15624: "circling",
        15625: "circular",
        15626: "circulate",
        15631: "circus",
        15632: "citable",
        15633: "citadel",
        15634: "citation",
        15635: "citizen",
        15636: "citric",
        15641: "citrus",
        15642: "city",
        15643: "civic",
        15644: "civil",
        15645: "clad",
        15646: "claim",
        15651: "clambake",
        15652: "clammy",
        15653: "clamor",
        15654: "clamp",
        15655: "clamshell",
        15656: "clang",
        15661: "clanking",
        15662: "clapped",
        15663: "clapper",
        15664: "clapping",
        15665: "clarify",
        15666: "clarinet",
        16111: "clarity",
        16112: "clash",
        16113: "clasp",
        16114: "class",
        16115: "clatter",
        16116: "clause",
        16121: "clavicle",
        16122: "claw",
        16123: "clay",
        16124: "clean",
        16125: "clear",
        16126: "cleat",
        16131: "cleaver",
        16132: "cleft",
        16133: "clench",
        16134: "clergyman",
        16135: "clerical",
        16136: "clerk",
        16141: "clever",
        16142: "clicker",
        16143: "client",
        16144: "climate",
        16145: "climatic",
        16146: "cling",
        16151: "clinic",
        16152: "clinking",
        16153: "clip",
        16154: "clique",
        16155: "cloak",
        16156: "clobber",
        16161: "clock",
        16162: "clone",
        16163: "cloning",
        16164: "closable",
        16165: "closure",
        16166: "clothes",
        16211: "clothing",
        16212: "cloud",
        16213: "clover",
        16214: "clubbed",
        16215: "clubbing",
        16216: "clubhouse",
        16221: "clump",
        16222: "clumsily",
        16223: "clumsy",
        16224: "clunky",
        16225: "clustered",
        16226: "clutch",
        16231: "clutter",
        16232: "coach",
        16233: "coagulant",
        16234: "coastal",
        16235: "coaster",
        16236: "coasting",
        16241: "coastland",
        16242: "coastline",
        16243: "coat",
        16244: "coauthor",
        16245: "cobalt",
        16246: "cobbler",
        16251: "cobweb",
        16252: "cocoa",
        16253: "coconut",
        16254: "cod",
        16255: "coeditor",
        16256: "coerce",
        16261: "coexist",
        16262: "coffee",
        16263: "cofounder",
        16264: "cognition",
        16265: "cognitive",
        16266: "cogwheel",
        16311: "coherence",
        16312: "coherent",
        16313: "cohesive",
        16314: "coil",
        16315: "coke",
        16316: "cola",
        16321: "cold",
        16322: "coleslaw",
        16323: "coliseum",
        16324: "collage",
        16325: "collapse",
        16326: "collar",
        16331: "collected",
        16332: "collector",
        16333: "collide",
        16334: "collie",
        16335: "collision",
        16336: "colonial",
        16341: "colonist",
        16342: "colonize",
        16343: "colony",
        16344: "colossal",
        16345: "colt",
        16346: "coma",
        16351: "come",
        16352: "comfort",
        16353: "comfy",
        16354: "comic",
        16355: "coming",
        16356: "comma",
        16361: "commence",
        16362: "commend",
        16363: "comment",
        16364: "commerce",
        16365: "commode",
        16366: "commodity",
        16411: "commodore",
        16412: "common",
        16413: "commotion",
        16414: "commute",
        16415: "commuting",
        16416: "compacted",
        16421: "compacter",
        16422: "compactly",
        16423: "compactor",
        16424: "companion",
        16425: "company",
        16426: "compare",
        16431: "compel",
        16432: "compile",
        16433: "comply",
        16434: "component",
        16435: "composed",
        16436: "composer",
        16441: "composite",
        16442: "compost",
        16443: "composure",
        16444: "compound",
        16445: "compress",
        16446: "comprised",
        16451: "computer",
        16452: "computing",
        16453: "comrade",
        16454: "concave",
        16455: "conceal",
        16456: "conceded",
        16461: "concept",
        16462: "concerned",
        16463: "concert",
        16464: "conch",
        16465: "concierge",
        16466: "concise",
        16511: "conclude",
        16512: "concrete",
        16513: "concur",
        16514: "condense",
        16515: "condiment",
        16516: "condition",
        16521: "condone",
        16522: "conducive",
        16523: "conductor",
        16524: "conduit",
        16525: "cone",
        16526: "confess",
        16531: "confetti",
        16532: "confidant",
        16533: "confident",
        16534: "confider",
        16535: "confiding",
        16536: "configure",
        16541: "confined",
        16542: "confining",
        16543: "confirm",
        16544: "conflict",
        16545: "conform",
        16546: "confound",
        16551: "confront",
        16552: "confused",
        16553: "confusing",
        16554: "confusion",
        16555: "congenial",
        16556: "congested",
        16561: "congrats",
        16562: "congress",
        16563: "conical",
        16564: "conjoined",
        16565: "conjure",
        16566: "conjuror",
        16611: "connected",
        16612: "connector",
        16613: "consensus",
        16614: "consent",
        16615: "console",
        16616: "consoling",
        16621: "consonant",
        16622: "constable",
        16623: "constant",
        16624: "constrain",
        16625: "constrict",
        16626: "construct",
        16631: "consult",
        16632: "consumer",
        16633: "consuming",
        16634: "contact",
        16635: "container",
        16636: "contempt",
        16641: "contend",
        16642: "contented",
        16643: "contently",
        16644: "contents",
        16645: "contest",
        16646: "context",
        16651: "contort",
        16652: "contour",
        16653: "contrite",
        16654: "control",
        16655: "contusion",
        16656: "convene",
        16661: "convent",
        16662: "copartner",
        16663: "cope",
        16664: "copied",
        16665: "copier",
        16666: "copilot",
        21111: "coping",
        21112: "copious",
        21113: "copper",
        21114: "copy",
        21115: "coral",
        21116: "cork",
        21121: "cornball",
        21122: "cornbread",
        21123: "corncob",
        21124: "cornea",
        21125: "corned",
        21126: "corner",
        21131: "cornfield",
        21132: "cornflake",
        21133: "cornhusk",
        21134: "cornmeal",
        21135: "cornstalk",
        21136: "corny",
        21141: "coronary",
        21142: "coroner",
        21143: "corporal",
        21144: "corporate",
        21145: "corral",
        21146: "correct",
        21151: "corridor",
        21152: "corrode",
        21153: "corroding",
        21154: "corrosive",
        21155: "corsage",
        21156: "corset",
        21161: "cortex",
        21162: "cosigner",
        21163: "cosmetics",
        21164: "cosmic",
        21165: "cosmos",
        21166: "cosponsor",
        21211: "cost",
        21212: "cottage",
        21213: "cotton",
        21214: "couch",
        21215: "cough",
        21216: "could",
        21221: "countable",
        21222: "countdown",
        21223: "counting",
        21224: "countless",
        21225: "country",
        21226: "county",
        21231: "courier",
        21232: "covenant",
        21233: "cover",
        21234: "coveted",
        21235: "coveting",
        21236: "coyness",
        21241: "cozily",
        21242: "coziness",
        21243: "cozy",
        21244: "crabbing",
        21245: "crabgrass",
        21246: "crablike",
        21251: "crabmeat",
        21252: "cradle",
        21253: "cradling",
        21254: "crafter",
        21255: "craftily",
        21256: "craftsman",
        21261: "craftwork",
        21262: "crafty",
        21263: "cramp",
        21264: "cranberry",
        21265: "crane",
        21266: "cranial",
        21311: "cranium",
        21312: "crank",
        21313: "crate",
        21314: "crave",
        21315: "craving",
        21316: "crawfish",
        21321: "crawlers",
        21322: "crawling",
        21323: "crayfish",
        21324: "crayon",
        21325: "crazed",
        21326: "crazily",
        21331: "craziness",
        21332: "crazy",
        21333: "creamed",
        21334: "creamer",
        21335: "creamlike",
        21336: "crease",
        21341: "creasing",
        21342: "creatable",
        21343: "create",
        21344: "creation",
        21345: "creative",
        21346: "creature",
        21351: "credible",
        21352: "credibly",
        21353: "credit",
        21354: "creed",
        21355: "creme",
        21356: "creole",
        21361: "crepe",
        21362: "crept",
        21363: "crescent",
        21364: "crested",
        21365: "cresting",
        21366: "crestless",
        21411: "crevice",
        21412: "crewless",
        21413: "crewman",
        21414: "crewmate",
        21415: "crib",
        21416: "cricket",
        21421: "cried",
        21422: "crier",
        21423: "crimp",
        21424: "crimson",
        21425: "cringe",
        21426: "cringing",
        21431: "crinkle",
        21432: "crinkly",
        21433: "crisped",
        21434: "crisping",
        21435: "crisply",
        21436: "crispness",
        21441: "crispy",
        21442: "criteria",
        21443: "critter",
        21444: "croak",
        21445: "crock",
        21446: "crook",
        21451: "croon",
        21452: "crop",
        21453: "cross",
        21454: "crouch",
        21455: "crouton",
        21456: "crowbar",
        21461: "crowd",
        21462: "crown",
        21463: "crucial",
        21464: "crudely",
        21465: "crudeness",
        21466: "cruelly",
        21511: "cruelness",
        21512: "cruelty",
        21513: "crumb",
        21514: "crummiest",
        21515: "crummy",
        21516: "crumpet",
        21521: "crumpled",
        21522: "cruncher",
        21523: "crunching",
        21524: "crunchy",
        21525: "crusader",
        21526: "crushable",
        21531: "crushed",
        21532: "crusher",
        21533: "crushing",
        21534: "crust",
        21535: "crux",
        21536: "crying",
        21541: "cryptic",
        21542: "crystal",
        21543: "cubbyhole",
        21544: "cube",
        21545: "cubical",
        21546: "cubicle",
        21551: "cucumber",
        21552: "cuddle",
        21553: "cuddly",
        21554: "cufflink",
        21555: "culinary",
        21556: "culminate",
        21561: "culpable",
        21562: "culprit",
        21563: "cultivate",
        21564: "cultural",
        21565: "culture",
        21566: "cupbearer",
        21611: "cupcake",
        21612: "cupid",
        21613: "cupped",
        21614: "cupping",
        21615: "curable",
        21616: "curator",
        21621: "curdle",
        21622: "cure",
        21623: "curfew",
        21624: "curing",
        21625: "curled",
        21626: "curler",
        21631: "curliness",
        21632: "curling",
        21633: "curly",
        21634: "curry",
        21635: "curse",
        21636: "cursive",
        21641: "cursor",
        21642: "curtain",
        21643: "curtly",
        21644: "curtsy",
        21645: "curvature",
        21646: "curve",
        21651: "curvy",
        21652: "cushy",
        21653: "cusp",
        21654: "cussed",
        21655: "custard",
        21656: "custodian",
        21661: "custody",
        21662: "customary",
        21663: "customer",
        21664: "customize",
        21665: "customs",
        21666: "cut",
        22111: "cycle",
        22112: "cyclic",
        22113: "cycling",
        22114: "cyclist",
        22115: "cylinder",
        22116: "cymbal",
        22121: "cytoplasm",
        22122: "cytoplast",
        22123: "dab",
        22124: "dad",
        22125: "daffodil",
        22126: "dagger",
        22131: "daily",
        22132: "daintily",
        22133: "dainty",
        22134: "dairy",
        22135: "daisy",
        22136: "dallying",
        22141: "dance",
        22142: "dancing",
        22143: "dandelion",
        22144: "dander",
        22145: "dandruff",
        22146: "dandy",
        22151: "danger",
        22152: "dangle",
        22153: "dangling",
        22154: "daredevil",
        22155: "dares",
        22156: "daringly",
        22161: "darkened",
        22162: "darkening",
        22163: "darkish",
        22164: "darkness",
        22165: "darkroom",
        22166: "darling",
        22211: "darn",
        22212: "dart",
        22213: "darwinism",
        22214: "dash",
        22215: "dastardly",
        22216: "data",
        22221: "datebook",
        22222: "dating",
        22223: "daughter",
        22224: "daunting",
        22225: "dawdler",
        22226: "dawn",
        22231: "daybed",
        22232: "daybreak",
        22233: "daycare",
        22234: "daydream",
        22235: "daylight",
        22236: "daylong",
        22241: "dayroom",
        22242: "daytime",
        22243: "dazzler",
        22244: "dazzling",
        22245: "deacon",
        22246: "deafening",
        22251: "deafness",
        22252: "dealer",
        22253: "dealing",
        22254: "dealmaker",
        22255: "dealt",
        22256: "dean",
        22261: "debatable",
        22262: "debate",
        22263: "debating",
        22264: "debit",
        22265: "debrief",
        22266: "debtless",
        22311: "debtor",
        22312: "debug",
        22313: "debunk",
        22314: "decade",
        22315: "decaf",
        22316: "decal",
        22321: "decathlon",
        22322: "decay",
        22323: "deceased",
        22324: "deceit",
        22325: "deceiver",
        22326: "deceiving",
        22331: "december",
        22332: "decency",
        22333: "decent",
        22334: "deception",
        22335: "deceptive",
        22336: "decibel",
        22341: "decidable",
        22342: "decimal",
        22343: "decimeter",
        22344: "decipher",
        22345: "deck",
        22346: "declared",
        22351: "decline",
        22352: "decode",
        22353: "decompose",
        22354: "decorated",
        22355: "decorator",
        22356: "decoy",
        22361: "decrease",
        22362: "decree",
        22363: "dedicate",
        22364: "dedicator",
        22365: "deduce",
        22366: "deduct",
        22411: "deed",
        22412: "deem",
        22413: "deepen",
        22414: "deeply",
        22415: "deepness",
        22416: "deface",
        22421: "defacing",
        22422: "defame",
        22423: "default",
        22424: "defeat",
        22425: "defection",
        22426: "defective",
        22431: "defendant",
        22432: "defender",
        22433: "defense",
        22434: "defensive",
        22435: "deferral",
        22436: "deferred",
        22441: "defiance",
        22442: "defiant",
        22443: "defile",
        22444: "defiling",
        22445: "define",
        22446: "definite",
        22451: "deflate",
        22452: "deflation",
        22453: "deflator",
        22454: "deflected",
        22455: "deflector",
        22456: "defog",
        22461: "deforest",
        22462: "defraud",
        22463: "defrost",
        22464: "deftly",
        22465: "defuse",
        22466: "defy",
        22511: "degraded",
        22512: "degrading",
        22513: "degrease",
        22514: "degree",
        22515: "dehydrate",
        22516: "deity",
        22521: "dejected",
        22522: "delay",
        22523: "delegate",
        22524: "delegator",
        22525: "delete",
        22526: "deletion",
        22531: "delicacy",
        22532: "delicate",
        22533: "delicious",
        22534: "delighted",
        22535: "delirious",
        22536: "delirium",
        22541: "deliverer",
        22542: "delivery",
        22543: "delouse",
        22544: "delta",
        22545: "deluge",
        22546: "delusion",
        22551: "deluxe",
        22552: "demanding",
        22553: "demeaning",
        22554: "demeanor",
        22555: "demise",
        22556: "democracy",
        22561: "democrat",
        22562: "demote",
        22563: "demotion",
        22564: "demystify",
        22565: "denatured",
        22566: "deniable",
        22611: "denial",
        22612: "denim",
        22613: "denote",
        22614: "dense",
        22615: "density",
        22616: "dental",
        22621: "dentist",
        22622: "denture",
        22623: "deny",
        22624: "deodorant",
        22625: "deodorize",
        22626: "departed",
        22631: "departure",
        22632: "depict",
        22633: "deplete",
        22634: "depletion",
        22635: "deplored",
        22636: "deploy",
        22641: "deport",
        22642: "depose",
        22643: "depraved",
        22644: "depravity",
        22645: "deprecate",
        22646: "depress",
        22651: "deprive",
        22652: "depth",
        22653: "deputize",
        22654: "deputy",
        22655: "derail",
        22656: "deranged",
        22661: "derby",
        22662: "derived",
        22663: "desecrate",
        22664: "deserve",
        22665: "deserving",
        22666: "designate",
        23111: "designed",
        23112: "designer",
        23113: "designing",
        23114: "deskbound",
        23115: "desktop",
        23116: "deskwork",
        23121: "desolate",
        23122: "despair",
        23123: "despise",
        23124: "despite",
        23125: "destiny",
        23126: "destitute",
        23131: "destruct",
        23132: "detached",
        23133: "detail",
        23134: "detection",
        23135: "detective",
        23136: "detector",
        23141: "detention",
        23142: "detergent",
        23143: "detest",
        23144: "detonate",
        23145: "detonator",
        23146: "detoxify",
        23151: "detract",
        23152: "deuce",
        23153: "devalue",
        23154: "deviancy",
        23155: "deviant",
        23156: "deviate",
        23161: "deviation",
        23162: "deviator",
        23163: "device",
        23164: "devious",
        23165: "devotedly",
        23166: "devotee",
        23211: "devotion",
        23212: "devourer",
        23213: "devouring",
        23214: "devoutly",
        23215: "dexterity",
        23216: "dexterous",
        23221: "diabetes",
        23222: "diabetic",
        23223: "diabolic",
        23224: "diagnoses",
        23225: "diagnosis",
        23226: "diagram",
        23231: "dial",
        23232: "diameter",
        23233: "diaper",
        23234: "diaphragm",
        23235: "diary",
        23236: "dice",
        23241: "dicing",
        23242: "dictate",
        23243: "dictation",
        23244: "dictator",
        23245: "difficult",
        23246: "diffused",
        23251: "diffuser",
        23252: "diffusion",
        23253: "diffusive",
        23254: "dig",
        23255: "dilation",
        23256: "diligence",
        23261: "diligent",
        23262: "dill",
        23263: "dilute",
        23264: "dime",
        23265: "diminish",
        23266: "dimly",
        23311: "dimmed",
        23312: "dimmer",
        23313: "dimness",
        23314: "dimple",
        23315: "diner",
        23316: "dingbat",
        23321: "dinghy",
        23322: "dinginess",
        23323: "dingo",
        23324: "dingy",
        23325: "dining",
        23326: "dinner",
        23331: "diocese",
        23332: "dioxide",
        23333: "diploma",
        23334: "dipped",
        23335: "dipper",
        23336: "dipping",
        23341: "directed",
        23342: "direction",
        23343: "directive",
        23344: "directly",
        23345: "directory",
        23346: "direness",
        23351: "dirtiness",
        23352: "disabled",
        23353: "disagree",
        23354: "disallow",
        23355: "disarm",
        23356: "disarray",
        23361: "disaster",
        23362: "disband",
        23363: "disbelief",
        23364: "disburse",
        23365: "discard",
        23366: "discern",
        23411: "discharge",
        23412: "disclose",
        23413: "discolor",
        23414: "discount",
        23415: "discourse",
        23416: "discover",
        23421: "discuss",
        23422: "disdain",
        23423: "disengage",
        23424: "disfigure",
        23425: "disgrace",
        23426: "dish",
        23431: "disinfect",
        23432: "disjoin",
        23433: "disk",
        23434: "dislike",
        23435: "disliking",
        23436: "dislocate",
        23441: "dislodge",
        23442: "disloyal",
        23443: "dismantle",
        23444: "dismay",
        23445: "dismiss",
        23446: "dismount",
        23451: "disobey",
        23452: "disorder",
        23453: "disown",
        23454: "disparate",
        23455: "disparity",
        23456: "dispatch",
        23461: "dispense",
        23462: "dispersal",
        23463: "dispersed",
        23464: "disperser",
        23465: "displace",
        23466: "display",
        23511: "displease",
        23512: "disposal",
        23513: "dispose",
        23514: "disprove",
        23515: "dispute",
        23516: "disregard",
        23521: "disrupt",
        23522: "dissuade",
        23523: "distance",
        23524: "distant",
        23525: "distaste",
        23526: "distill",
        23531: "distinct",
        23532: "distort",
        23533: "distract",
        23534: "distress",
        23535: "district",
        23536: "distrust",
        23541: "ditch",
        23542: "ditto",
        23543: "ditzy",
        23544: "dividable",
        23545: "divided",
        23546: "dividend",
        23551: "dividers",
        23552: "dividing",
        23553: "divinely",
        23554: "diving",
        23555: "divinity",
        23556: "divisible",
        23561: "divisibly",
        23562: "division",
        23563: "divisive",
        23564: "divorcee",
        23565: "dizziness",
        23566: "dizzy",
        23611: "doable",
        23612: "docile",
        23613: "dock",
        23614: "doctrine",
        23615: "document",
        23616: "dodge",
        23621: "dodgy",
        23622: "doily",
        23623: "doing",
        23624: "dole",
        23625: "dollar",
        23626: "dollhouse",
        23631: "dollop",
        23632: "dolly",
        23633: "dolphin",
        23634: "domain",
        23635: "domelike",
        23636: "domestic",
        23641: "dominion",
        23642: "dominoes",
        23643: "donated",
        23644: "donation",
        23645: "donator",
        23646: "donor",
        23651: "donut",
        23652: "doodle",
        23653: "doorbell",
        23654: "doorframe",
        23655: "doorknob",
        23656: "doorman",
        23661: "doormat",
        23662: "doornail",
        23663: "doorpost",
        23664: "doorstep",
        23665: "doorstop",
        23666: "doorway",
        24111: "doozy",
        24112: "dork",
        24113: "dormitory",
        24114: "dorsal",
        24115: "dosage",
        24116: "dose",
        24121: "dotted",
        24122: "doubling",
        24123: "douche",
        24124: "dove",
        24125: "down",
        24126: "dowry",
        24131: "doze",
        24132: "drab",
        24133: "dragging",
        24134: "dragonfly",
        24135: "dragonish",
        24136: "dragster",
        24141: "drainable",
        24142: "drainage",
        24143: "drained",
        24144: "drainer",
        24145: "drainpipe",
        24146: "dramatic",
        24151: "dramatize",
        24152: "drank",
        24153: "drapery",
        24154: "drastic",
        24155: "draw",
        24156: "dreaded",
        24161: "dreadful",
        24162: "dreadlock",
        24163: "dreamboat",
        24164: "dreamily",
        24165: "dreamland",
        24166: "dreamless",
        24211: "dreamlike",
        24212: "dreamt",
        24213: "dreamy",
        24214: "drearily",
        24215: "dreary",
        24216: "drench",
        24221: "dress",
        24222: "drew",
        24223: "dribble",
        24224: "dried",
        24225: "drier",
        24226: "drift",
        24231: "driller",
        24232: "drilling",
        24233: "drinkable",
        24234: "drinking",
        24235: "dripping",
        24236: "drippy",
        24241: "drivable",
        24242: "driven",
        24243: "driver",
        24244: "driveway",
        24245: "driving",
        24246: "drizzle",
        24251: "drizzly",
        24252: "drone",
        24253: "drool",
        24254: "droop",
        24255: "drop-down",
        24256: "dropbox",
        24261: "dropkick",
        24262: "droplet",
        24263: "dropout",
        24264: "dropper",
        24265: "drove",
        24266: "drown",
        24311: "drowsily",
        24312: "drudge",
        24313: "drum",
        24314: "dry",
        24315: "dubbed",
        24316: "dubiously",
        24321: "duchess",
        24322: "duckbill",
        24323: "ducking",
        24324: "duckling",
        24325: "ducktail",
        24326: "ducky",
        24331: "duct",
        24332: "dude",
        24333: "duffel",
        24334: "dugout",
        24335: "duh",
        24336: "duke",
        24341: "duller",
        24342: "dullness",
        24343: "duly",
        24344: "dumping",
        24345: "dumpling",
        24346: "dumpster",
        24351: "duo",
        24352: "dupe",
        24353: "duplex",
        24354: "duplicate",
        24355: "duplicity",
        24356: "durable",
        24361: "durably",
        24362: "duration",
        24363: "duress",
        24364: "during",
        24365: "dusk",
        24366: "dust",
        24411: "dutiful",
        24412: "duty",
        24413: "duvet",
        24414: "dwarf",
        24415: "dweeb",
        24416: "dwelled",
        24421: "dweller",
        24422: "dwelling",
        24423: "dwindle",
        24424: "dwindling",
        24425: "dynamic",
        24426: "dynamite",
        24431: "dynasty",
        24432: "dyslexia",
        24433: "dyslexic",
        24434: "each",
        24435: "eagle",
        24436: "earache",
        24441: "eardrum",
        24442: "earflap",
        24443: "earful",
        24444: "earlobe",
        24445: "early",
        24446: "earmark",
        24451: "earmuff",
        24452: "earphone",
        24453: "earpiece",
        24454: "earplugs",
        24455: "earring",
        24456: "earshot",
        24461: "earthen",
        24462: "earthlike",
        24463: "earthling",
        24464: "earthly",
        24465: "earthworm",
        24466: "earthy",
        24511: "earwig",
        24512: "easeful",
        24513: "easel",
        24514: "easiest",
        24515: "easily",
        24516: "easiness",
        24521: "easing",
        24522: "eastbound",
        24523: "eastcoast",
        24524: "easter",
        24525: "eastward",
        24526: "eatable",
        24531: "eaten",
        24532: "eatery",
        24533: "eating",
        24534: "eats",
        24535: "ebay",
        24536: "ebony",
        24541: "ebook",
        24542: "ecard",
        24543: "eccentric",
        24544: "echo",
        24545: "eclair",
        24546: "eclipse",
        24551: "ecologist",
        24552: "ecology",
        24553: "economic",
        24554: "economist",
        24555: "economy",
        24556: "ecosphere",
        24561: "ecosystem",
        24562: "edge",
        24563: "edginess",
        24564: "edging",
        24565: "edgy",
        24566: "edition",
        24611: "editor",
        24612: "educated",
        24613: "education",
        24614: "educator",
        24615: "eel",
        24616: "effective",
        24621: "effects",
        24622: "efficient",
        24623: "effort",
        24624: "eggbeater",
        24625: "egging",
        24626: "eggnog",
        24631: "eggplant",
        24632: "eggshell",
        24633: "egomaniac",
        24634: "egotism",
        24635: "egotistic",
        24636: "either",
        24641: "eject",
        24642: "elaborate",
        24643: "elastic",
        24644: "elated",
        24645: "elbow",
        24646: "eldercare",
        24651: "elderly",
        24652: "eldest",
        24653: "electable",
        24654: "election",
        24655: "elective",
        24656: "elephant",
        24661: "elevate",
        24662: "elevating",
        24663: "elevation",
        24664: "elevator",
        24665: "eleven",
        24666: "elf",
        25111: "eligible",
        25112: "eligibly",
        25113: "eliminate",
        25114: "elite",
        25115: "elitism",
        25116: "elixir",
        25121: "elk",
        25122: "ellipse",
        25123: "elliptic",
        25124: "elm",
        25125: "elongated",
        25126: "elope",
        25131: "eloquence",
        25132: "eloquent",
        25133: "elsewhere",
        25134: "elude",
        25135: "elusive",
        25136: "elves",
        25141: "email",
        25142: "embargo",
        25143: "embark",
        25144: "embassy",
        25145: "embattled",
        25146: "embellish",
        25151: "ember",
        25152: "embezzle",
        25153: "emblaze",
        25154: "emblem",
        25155: "embody",
        25156: "embolism",
        25161: "emboss",
        25162: "embroider",
        25163: "emcee",
        25164: "emerald",
        25165: "emergency",
        25166: "emission",
        25211: "emit",
        25212: "emote",
        25213: "emoticon",
        25214: "emotion",
        25215: "empathic",
        25216: "empathy",
        25221: "emperor",
        25222: "emphases",
        25223: "emphasis",
        25224: "emphasize",
        25225: "emphatic",
        25226: "empirical",
        25231: "employed",
        25232: "employee",
        25233: "employer",
        25234: "emporium",
        25235: "empower",
        25236: "emptier",
        25241: "emptiness",
        25242: "empty",
        25243: "emu",
        25244: "enable",
        25245: "enactment",
        25246: "enamel",
        25251: "enchanted",
        25252: "enchilada",
        25253: "encircle",
        25254: "enclose",
        25255: "enclosure",
        25256: "encode",
        25261: "encore",
        25262: "encounter",
        25263: "encourage",
        25264: "encroach",
        25265: "encrust",
        25266: "encrypt",
        25311: "endanger",
        25312: "endeared",
        25313: "endearing",
        25314: "ended",
        25315: "ending",
        25316: "endless",
        25321: "endnote",
        25322: "endocrine",
        25323: "endorphin",
        25324: "endorse",
        25325: "endowment",
        25326: "endpoint",
        25331: "endurable",
        25332: "endurance",
        25333: "enduring",
        25334: "energetic",
        25335: "energize",
        25336: "energy",
        25341: "enforced",
        25342: "enforcer",
        25343: "engaged",
        25344: "engaging",
        25345: "engine",
        25346: "engorge",
        25351: "engraved",
        25352: "engraver",
        25353: "engraving",
        25354: "engross",
        25355: "engulf",
        25356: "enhance",
        25361: "enigmatic",
        25362: "enjoyable",
        25363: "enjoyably",
        25364: "enjoyer",
        25365: "enjoying",
        25366: "enjoyment",
        25411: "enlarged",
        25412: "enlarging",
        25413: "enlighten",
        25414: "enlisted",
        25415: "enquirer",
        25416: "enrage",
        25421: "enrich",
        25422: "enroll",
        25423: "enslave",
        25424: "ensnare",
        25425: "ensure",
        25426: "entail",
        25431: "entangled",
        25432: "entering",
        25433: "entertain",
        25434: "enticing",
        25435: "entire",
        25436: "entitle",
        25441: "entity",
        25442: "entomb",
        25443: "entourage",
        25444: "entrap",
        25445: "entree",
        25446: "entrench",
        25451: "entrust",
        25452: "entryway",
        25453: "entwine",
        25454: "enunciate",
        25455: "envelope",
        25456: "enviable",
        25461: "enviably",
        25462: "envious",
        25463: "envision",
        25464: "envoy",
        25465: "envy",
        25466: "enzyme",
        25511: "epic",
        25512: "epidemic",
        25513: "epidermal",
        25514: "epidermis",
        25515: "epidural",
        25516: "epilepsy",
        25521: "epileptic",
        25522: "epilogue",
        25523: "epiphany",
        25524: "episode",
        25525: "equal",
        25526: "equate",
        25531: "equation",
        25532: "equator",
        25533: "equinox",
        25534: "equipment",
        25535: "equity",
        25536: "equivocal",
        25541: "eradicate",
        25542: "erasable",
        25543: "erased",
        25544: "eraser",
        25545: "erasure",
        25546: "ergonomic",
        25551: "errand",
        25552: "errant",
        25553: "erratic",
        25554: "error",
        25555: "erupt",
        25556: "escalate",
        25561: "escalator",
        25562: "escapable",
        25563: "escapade",
        25564: "escapist",
        25565: "escargot",
        25566: "eskimo",
        25611: "esophagus",
        25612: "espionage",
        25613: "espresso",
        25614: "esquire",
        25615: "essay",
        25616: "essence",
        25621: "essential",
        25622: "establish",
        25623: "estate",
        25624: "esteemed",
        25625: "estimate",
        25626: "estimator",
        25631: "estranged",
        25632: "estrogen",
        25633: "etching",
        25634: "eternal",
        25635: "eternity",
        25636: "ethanol",
        25641: "ether",
        25642: "ethically",
        25643: "ethics",
        25644: "euphemism",
        25645: "evacuate",
        25646: "evacuee",
        25651: "evade",
        25652: "evaluate",
        25653: "evaluator",
        25654: "evaporate",
        25655: "evasion",
        25656: "evasive",
        25661: "even",
        25662: "everglade",
        25663: "evergreen",
        25664: "everybody",
        25665: "everyday",
        25666: "everyone",
        26111: "evict",
        26112: "evidence",
        26113: "evident",
        26114: "evil",
        26115: "evoke",
        26116: "evolution",
        26121: "evolve",
        26122: "exact",
        26123: "exalted",
        26124: "example",
        26125: "excavate",
        26126: "excavator",
        26131: "exceeding",
        26132: "exception",
        26133: "excess",
        26134: "exchange",
        26135: "excitable",
        26136: "exciting",
        26141: "exclaim",
        26142: "exclude",
        26143: "excluding",
        26144: "exclusion",
        26145: "exclusive",
        26146: "excretion",
        26151: "excretory",
        26152: "excursion",
        26153: "excusable",
        26154: "excusably",
        26155: "excuse",
        26156: "exemplary",
        26161: "exemplify",
        26162: "exemption",
        26163: "exerciser",
        26164: "exert",
        26165: "exes",
        26166: "exfoliate",
        26211: "exhale",
        26212: "exhaust",
        26213: "exhume",
        26214: "exile",
        26215: "existing",
        26216: "exit",
        26221: "exodus",
        26222: "exonerate",
        26223: "exorcism",
        26224: "exorcist",
        26225: "expand",
        26226: "expanse",
        26231: "expansion",
        26232: "expansive",
        26233: "expectant",
        26234: "expedited",
        26235: "expediter",
        26236: "expel",
        26241: "expend",
        26242: "expenses",
        26243: "expensive",
        26244: "expert",
        26245: "expire",
        26246: "expiring",
        26251: "explain",
        26252: "expletive",
        26253: "explicit",
        26254: "explode",
        26255: "exploit",
        26256: "explore",
        26261: "exploring",
        26262: "exponent",
        26263: "exporter",
        26264: "exposable",
        26265: "expose",
        26266: "exposure",
        26311: "express",
        26312: "expulsion",
        26313: "exquisite",
        26314: "extended",
        26315: "extending",
        26316: "extent",
        26321: "extenuate",
        26322: "exterior",
        26323: "external",
        26324: "extinct",
        26325: "extortion",
        26326: "extradite",
        26331: "extras",
        26332: "extrovert",
        26333: "extrude",
        26334: "extruding",
        26335: "exuberant",
        26336: "fable",
        26341: "fabric",
        26342: "fabulous",
        26343: "facebook",
        26344: "facecloth",
        26345: "facedown",
        26346: "faceless",
        26351: "facelift",
        26352: "faceplate",
        26353: "faceted",
        26354: "facial",
        26355: "facility",
        26356: "facing",
        26361: "facsimile",
        26362: "faction",
        26363: "factoid",
        26364: "factor",
        26365: "factsheet",
        26366: "factual",
        26411: "faculty",
        26412: "fade",
        26413: "fading",
        26414: "failing",
        26415: "falcon",
        26416: "fall",
        26421: "false",
        26422: "falsify",
        26423: "fame",
        26424: "familiar",
        26425: "family",
        26426: "famine",
        26431: "famished",
        26432: "fanatic",
        26433: "fancied",
        26434: "fanciness",
        26435: "fancy",
        26436: "fanfare",
        26441: "fang",
        26442: "fanning",
        26443: "fantasize",
        26444: "fantastic",
        26445: "fantasy",
        26446: "fascism",
        26451: "fastball",
        26452: "faster",
        26453: "fasting",
        26454: "fastness",
        26455: "faucet",
        26456: "favorable",
        26461: "favorably",
        26462: "favored",
        26463: "favoring",
        26464: "favorite",
        26465: "fax",
        26466: "feast",
        26511: "federal",
        26512: "fedora",
        26513: "feeble",
        26514: "feed",
        26515: "feel",
        26516: "feisty",
        26521: "feline",
        26522: "felt-tip",
        26523: "feminine",
        26524: "feminism",
        26525: "feminist",
        26526: "feminize",
        26531: "femur",
        26532: "fence",
        26533: "fencing",
        26534: "fender",
        26535: "ferment",
        26536: "fernlike",
        26541: "ferocious",
        26542: "ferocity",
        26543: "ferret",
        26544: "ferris",
        26545: "ferry",
        26546: "fervor",
        26551: "fester",
        26552: "festival",
        26553: "festive",
        26554: "festivity",
        26555: "fetal",
        26556: "fetch",
        26561: "fever",
        26562: "fiber",
        26563: "fiction",
        26564: "fiddle",
        26565: "fiddling",
        26566: "fidelity",
        26611: "fidgeting",
        26612: "fidgety",
        26613: "fifteen",
        26614: "fifth",
        26615: "fiftieth",
        26616: "fifty",
        26621: "figment",
        26622: "figure",
        26623: "figurine",
        26624: "filing",
        26625: "filled",
        26626: "filler",
        26631: "filling",
        26632: "film",
        26633: "filter",
        26634: "filth",
        26635: "filtrate",
        26636: "finale",
        26641: "finalist",
        26642: "finalize",
        26643: "finally",
        26644: "finance",
        26645: "financial",
        26646: "finch",
        26651: "fineness",
        26652: "finer",
        26653: "finicky",
        26654: "finished",
        26655: "finisher",
        26656: "finishing",
        26661: "finite",
        26662: "finless",
        26663: "finlike",
        26664: "fiscally",
        26665: "fit",
        26666: "five",
        31111: "flaccid",
        31112: "flagman",
        31113: "flagpole",
        31114: "flagship",
        31115: "flagstick",
        31116: "flagstone",
        31121: "flail",
        31122: "flakily",
        31123: "flaky",
        31124: "flame",
        31125: "flammable",
        31126: "flanked",
        31131: "flanking",
        31132: "flannels",
        31133: "flap",
        31134: "flaring",
        31135: "flashback",
        31136: "flashbulb",
        31141: "flashcard",
        31142: "flashily",
        31143: "flashing",
        31144: "flashy",
        31145: "flask",
        31146: "flatbed",
        31151: "flatfoot",
        31152: "flatly",
        31153: "flatness",
        31154: "flatten",
        31155: "flattered",
        31156: "flatterer",
        31161: "flattery",
        31162: "flattop",
        31163: "flatware",
        31164: "flatworm",
        31165: "flavored",
        31166: "flavorful",
        31211: "flavoring",
        31212: "flaxseed",
        31213: "fled",
        31214: "fleshed",
        31215: "fleshy",
        31216: "flick",
        31221: "flier",
        31222: "flight",
        31223: "flinch",
        31224: "fling",
        31225: "flint",
        31226: "flip",
        31231: "flirt",
        31232: "float",
        31233: "flock",
        31234: "flogging",
        31235: "flop",
        31236: "floral",
        31241: "florist",
        31242: "floss",
        31243: "flounder",
        31244: "flyable",
        31245: "flyaway",
        31246: "flyer",
        31251: "flying",
        31252: "flyover",
        31253: "flypaper",
        31254: "foam",
        31255: "foe",
        31256: "fog",
        31261: "foil",
        31262: "folic",
        31263: "folk",
        31264: "follicle",
        31265: "follow",
        31266: "fondling",
        31311: "fondly",
        31312: "fondness",
        31313: "fondue",
        31314: "font",
        31315: "food",
        31316: "fool",
        31321: "footage",
        31322: "football",
        31323: "footbath",
        31324: "footboard",
        31325: "footer",
        31326: "footgear",
        31331: "foothill",
        31332: "foothold",
        31333: "footing",
        31334: "footless",
        31335: "footman",
        31336: "footnote",
        31341: "footpad",
        31342: "footpath",
        31343: "footprint",
        31344: "footrest",
        31345: "footsie",
        31346: "footsore",
        31351: "footwear",
        31352: "footwork",
        31353: "fossil",
        31354: "foster",
        31355: "founder",
        31356: "founding",
        31361: "fountain",
        31362: "fox",
        31363: "foyer",
        31364: "fraction",
        31365: "fracture",
        31366: "fragile",
        31411: "fragility",
        31412: "fragment",
        31413: "fragrance",
        31414: "fragrant",
        31415: "frail",
        31416: "frame",
        31421: "framing",
        31422: "frantic",
        31423: "fraternal",
        31424: "frayed",
        31425: "fraying",
        31426: "frays",
        31431: "freckled",
        31432: "freckles",
        31433: "freebase",
        31434: "freebee",
        31435: "freebie",
        31436: "freedom",
        31441: "freefall",
        31442: "freehand",
        31443: "freeing",
        31444: "freeload",
        31445: "freely",
        31446: "freemason",
        31451: "freeness",
        31452: "freestyle",
        31453: "freeware",
        31454: "freeway",
        31455: "freewill",
        31456: "freezable",
        31461: "freezing",
        31462: "freight",
        31463: "french",
        31464: "frenzied",
        31465: "frenzy",
        31466: "frequency",
        31511: "frequent",
        31512: "fresh",
        31513: "fretful",
        31514: "fretted",
        31515: "friction",
        31516: "friday",
        31521: "fridge",
        31522: "fried",
        31523: "friend",
        31524: "frighten",
        31525: "frightful",
        31526: "frigidity",
        31531: "frigidly",
        31532: "frill",
        31533: "fringe",
        31534: "frisbee",
        31535: "frisk",
        31536: "fritter",
        31541: "frivolous",
        31542: "frolic",
        31543: "from",
        31544: "front",
        31545: "frostbite",
        31546: "frosted",
        31551: "frostily",
        31552: "frosting",
        31553: "frostlike",
        31554: "frosty",
        31555: "froth",
        31556: "frown",
        31561: "frozen",
        31562: "fructose",
        31563: "frugality",
        31564: "frugally",
        31565: "fruit",
        31566: "frustrate",
        31611: "frying",
        31612: "gab",
        31613: "gaffe",
        31614: "gag",
        31615: "gainfully",
        31616: "gaining",
        31621: "gains",
        31622: "gala",
        31623: "gallantly",
        31624: "galleria",
        31625: "gallery",
        31626: "galley",
        31631: "gallon",
        31632: "gallows",
        31633: "gallstone",
        31634: "galore",
        31635: "galvanize",
        31636: "gambling",
        31641: "game",
        31642: "gaming",
        31643: "gamma",
        31644: "gander",
        31645: "gangly",
        31646: "gangrene",
        31651: "gangway",
        31652: "gap",
        31653: "garage",
        31654: "garbage",
        31655: "garden",
        31656: "gargle",
        31661: "garland",
        31662: "garlic",
        31663: "garment",
        31664: "garnet",
        31665: "garnish",
        31666: "garter",
        32111: "gas",
        32112: "gatherer",
        32113: "gathering",
        32114: "gating",
        32115: "gauging",
        32116: "gauntlet",
        32121: "gauze",
        32122: "gave",
        32123: "gawk",
        32124: "gazing",
        32125: "gear",
        32126: "gecko",
        32131: "geek",
        32132: "geiger",
        32133: "gem",
        32134: "gender",
        32135: "generic",
        32136: "generous",
        32141: "genetics",
        32142: "genre",
        32143: "gentile",
        32144: "gentleman",
        32145: "gently",
        32146: "gents",
        32151: "geography",
        32152: "geologic",
        32153: "geologist",
        32154: "geology",
        32155: "geometric",
        32156: "geometry",
        32161: "geranium",
        32162: "gerbil",
        32163: "geriatric",
        32164: "germicide",
        32165: "germinate",
        32166: "germless",
        32211: "germproof",
        32212: "gestate",
        32213: "gestation",
        32214: "gesture",
        32215: "getaway",
        32216: "getting",
        32221: "getup",
        32222: "giant",
        32223: "gibberish",
        32224: "giblet",
        32225: "giddily",
        32226: "giddiness",
        32231: "giddy",
        32232: "gift",
        32233: "gigabyte",
        32234: "gigahertz",
        32235: "gigantic",
        32236: "giggle",
        32241: "giggling",
        32242: "giggly",
        32243: "gigolo",
        32244: "gilled",
        32245: "gills",
        32246: "gimmick",
        32251: "girdle",
        32252: "giveaway",
        32253: "given",
        32254: "giver",
        32255: "giving",
        32256: "gizmo",
        32261: "gizzard",
        32262: "glacial",
        32263: "glacier",
        32264: "glade",
        32265: "gladiator",
        32266: "gladly",
        32311: "glamorous",
        32312: "glamour",
        32313: "glance",
        32314: "glancing",
        32315: "glandular",
        32316: "glare",
        32321: "glaring",
        32322: "glass",
        32323: "glaucoma",
        32324: "glazing",
        32325: "gleaming",
        32326: "gleeful",
        32331: "glider",
        32332: "gliding",
        32333: "glimmer",
        32334: "glimpse",
        32335: "glisten",
        32336: "glitch",
        32341: "glitter",
        32342: "glitzy",
        32343: "gloater",
        32344: "gloating",
        32345: "gloomily",
        32346: "gloomy",
        32351: "glorified",
        32352: "glorifier",
        32353: "glorify",
        32354: "glorious",
        32355: "glory",
        32356: "gloss",
        32361: "glove",
        32362: "glowing",
        32363: "glowworm",
        32364: "glucose",
        32365: "glue",
        32366: "gluten",
        32411: "glutinous",
        32412: "glutton",
        32413: "gnarly",
        32414: "gnat",
        32415: "goal",
        32416: "goatskin",
        32421: "goes",
        32422: "goggles",
        32423: "going",
        32424: "goldfish",
        32425: "goldmine",
        32426: "goldsmith",
        32431: "golf",
        32432: "goliath",
        32433: "gonad",
        32434: "gondola",
        32435: "gone",
        32436: "gong",
        32441: "good",
        32442: "gooey",
        32443: "goofball",
        32444: "goofiness",
        32445: "goofy",
        32446: "google",
        32451: "goon",
        32452: "gopher",
        32453: "gore",
        32454: "gorged",
        32455: "gorgeous",
        32456: "gory",
        32461: "gosling",
        32462: "gossip",
        32463: "gothic",
        32464: "gotten",
        32465: "gout",
        32466: "gown",
        32511: "grab",
        32512: "graceful",
        32513: "graceless",
        32514: "gracious",
        32515: "gradation",
        32516: "graded",
        32521: "grader",
        32522: "gradient",
        32523: "grading",
        32524: "gradually",
        32525: "graduate",
        32526: "graffiti",
        32531: "grafted",
        32532: "grafting",
        32533: "grain",
        32534: "granddad",
        32535: "grandkid",
        32536: "grandly",
        32541: "grandma",
        32542: "grandpa",
        32543: "grandson",
        32544: "granite",
        32545: "granny",
        32546: "granola",
        32551: "grant",
        32552: "granular",
        32553: "grape",
        32554: "graph",
        32555: "grapple",
        32556: "grappling",
        32561: "grasp",
        32562: "grass",
        32563: "gratified",
        32564: "gratify",
        32565: "grating",
        32566: "gratitude",
        32611: "gratuity",
        32612: "gravel",
        32613: "graveness",
        32614: "graves",
        32615: "graveyard",
        32616: "gravitate",
        32621: "gravity",
        32622: "gravy",
        32623: "gray",
        32624: "grazing",
        32625: "greasily",
        32626: "greedily",
        32631: "greedless",
        32632: "greedy",
        32633: "green",
        32634: "greeter",
        32635: "greeting",
        32636: "grew",
        32641: "greyhound",
        32642: "grid",
        32643: "grief",
        32644: "grievance",
        32645: "grieving",
        32646: "grievous",
        32651: "grill",
        32652: "grimace",
        32653: "grimacing",
        32654: "grime",
        32655: "griminess",
        32656: "grimy",
        32661: "grinch",
        32662: "grinning",
        32663: "grip",
        32664: "gristle",
        32665: "grit",
        32666: "groggily",
        33111: "groggy",
        33112: "groin",
        33113: "groom",
        33114: "groove",
        33115: "grooving",
        33116: "groovy",
        33121: "grope",
        33122: "ground",
        33123: "grouped",
        33124: "grout",
        33125: "grove",
        33126: "grower",
        33131: "growing",
        33132: "growl",
        33133: "grub",
        33134: "grudge",
        33135: "grudging",
        33136: "grueling",
        33141: "gruffly",
        33142: "grumble",
        33143: "grumbling",
        33144: "grumbly",
        33145: "grumpily",
        33146: "grunge",
        33151: "grunt",
        33152: "guacamole",
        33153: "guidable",
        33154: "guidance",
        33155: "guide",
        33156: "guiding",
        33161: "guileless",
        33162: "guise",
        33163: "gulf",
        33164: "gullible",
        33165: "gully",
        33166: "gulp",
        33211: "gumball",
        33212: "gumdrop",
        33213: "gumminess",
        33214: "gumming",
        33215: "gummy",
        33216: "gurgle",
        33221: "gurgling",
        33222: "guru",
        33223: "gush",
        33224: "gusto",
        33225: "gusty",
        33226: "gutless",
        33231: "guts",
        33232: "gutter",
        33233: "guy",
        33234: "guzzler",
        33235: "gyration",
        33236: "habitable",
        33241: "habitant",
        33242: "habitat",
        33243: "habitual",
        33244: "hacked",
        33245: "hacker",
        33246: "hacking",
        33251: "hacksaw",
        33252: "had",
        33253: "haggler",
        33254: "haiku",
        33255: "half",
        33256: "halogen",
        33261: "halt",
        33262: "halved",
        33263: "halves",
        33264: "hamburger",
        33265: "hamlet",
        33266: "hammock",
        33311: "hamper",
        33312: "hamster",
        33313: "hamstring",
        33314: "handbag",
        33315: "handball",
        33316: "handbook",
        33321: "handbrake",
        33322: "handcart",
        33323: "handclap",
        33324: "handclasp",
        33325: "handcraft",
        33326: "handcuff",
        33331: "handed",
        33332: "handful",
        33333: "handgrip",
        33334: "handgun",
        33335: "handheld",
        33336: "handiness",
        33341: "handiwork",
        33342: "handlebar",
        33343: "handled",
        33344: "handler",
        33345: "handling",
        33346: "handmade",
        33351: "handoff",
        33352: "handpick",
        33353: "handprint",
        33354: "handrail",
        33355: "handsaw",
        33356: "handset",
        33361: "handsfree",
        33362: "handshake",
        33363: "handstand",
        33364: "handwash",
        33365: "handwork",
        33366: "handwoven",
        33411: "handwrite",
        33412: "handyman",
        33413: "hangnail",
        33414: "hangout",
        33415: "hangover",
        33416: "hangup",
        33421: "hankering",
        33422: "hankie",
        33423: "hanky",
        33424: "haphazard",
        33425: "happening",
        33426: "happier",
        33431: "happiest",
        33432: "happily",
        33433: "happiness",
        33434: "happy",
        33435: "harbor",
        33436: "hardcopy",
        33441: "hardcore",
        33442: "hardcover",
        33443: "harddisk",
        33444: "hardened",
        33445: "hardener",
        33446: "hardening",
        33451: "hardhat",
        33452: "hardhead",
        33453: "hardiness",
        33454: "hardly",
        33455: "hardness",
        33456: "hardship",
        33461: "hardware",
        33462: "hardwired",
        33463: "hardwood",
        33464: "hardy",
        33465: "harmful",
        33466: "harmless",
        33511: "harmonica",
        33512: "harmonics",
        33513: "harmonize",
        33514: "harmony",
        33515: "harness",
        33516: "harpist",
        33521: "harsh",
        33522: "harvest",
        33523: "hash",
        33524: "hassle",
        33525: "haste",
        33526: "hastily",
        33531: "hastiness",
        33532: "hasty",
        33533: "hatbox",
        33534: "hatchback",
        33535: "hatchery",
        33536: "hatchet",
        33541: "hatching",
        33542: "hatchling",
        33543: "hate",
        33544: "hatless",
        33545: "hatred",
        33546: "haunt",
        33551: "haven",
        33552: "hazard",
        33553: "hazelnut",
        33554: "hazily",
        33555: "haziness",
        33556: "hazing",
        33561: "hazy",
        33562: "headache",
        33563: "headband",
        33564: "headboard",
        33565: "headcount",
        33566: "headdress",
        33611: "headed",
        33612: "header",
        33613: "headfirst",
        33614: "headgear",
        33615: "heading",
        33616: "headlamp",
        33621: "headless",
        33622: "headlock",
        33623: "headphone",
        33624: "headpiece",
        33625: "headrest",
        33626: "headroom",
        33631: "headscarf",
        33632: "headset",
        33633: "headsman",
        33634: "headstand",
        33635: "headstone",
        33636: "headway",
        33641: "headwear",
        33642: "heap",
        33643: "heat",
        33644: "heave",
        33645: "heavily",
        33646: "heaviness",
        33651: "heaving",
        33652: "hedge",
        33653: "hedging",
        33654: "heftiness",
        33655: "hefty",
        33656: "helium",
        33661: "helmet",
        33662: "helper",
        33663: "helpful",
        33664: "helping",
        33665: "helpless",
        33666: "helpline",
        34111: "hemlock",
        34112: "hemstitch",
        34113: "hence",
        34114: "henchman",
        34115: "henna",
        34116: "herald",
        34121: "herbal",
        34122: "herbicide",
        34123: "herbs",
        34124: "heritage",
        34125: "hermit",
        34126: "heroics",
        34131: "heroism",
        34132: "herring",
        34133: "herself",
        34134: "hertz",
        34135: "hesitancy",
        34136: "hesitant",
        34141: "hesitate",
        34142: "hexagon",
        34143: "hexagram",
        34144: "hubcap",
        34145: "huddle",
        34146: "huddling",
        34151: "huff",
        34152: "hug",
        34153: "hula",
        34154: "hulk",
        34155: "hull",
        34156: "human",
        34161: "humble",
        34162: "humbling",
        34163: "humbly",
        34164: "humid",
        34165: "humiliate",
        34166: "humility",
        34211: "humming",
        34212: "hummus",
        34213: "humongous",
        34214: "humorist",
        34215: "humorless",
        34216: "humorous",
        34221: "humpback",
        34222: "humped",
        34223: "humvee",
        34224: "hunchback",
        34225: "hundredth",
        34226: "hunger",
        34231: "hungrily",
        34232: "hungry",
        34233: "hunk",
        34234: "hunter",
        34235: "hunting",
        34236: "huntress",
        34241: "huntsman",
        34242: "hurdle",
        34243: "hurled",
        34244: "hurler",
        34245: "hurling",
        34246: "hurray",
        34251: "hurricane",
        34252: "hurried",
        34253: "hurry",
        34254: "hurt",
        34255: "husband",
        34256: "hush",
        34261: "husked",
        34262: "huskiness",
        34263: "hut",
        34264: "hybrid",
        34265: "hydrant",
        34266: "hydrated",
        34311: "hydration",
        34312: "hydrogen",
        34313: "hydroxide",
        34314: "hyperlink",
        34315: "hypertext",
        34316: "hyphen",
        34321: "hypnoses",
        34322: "hypnosis",
        34323: "hypnotic",
        34324: "hypnotism",
        34325: "hypnotist",
        34326: "hypnotize",
        34331: "hypocrisy",
        34332: "hypocrite",
        34333: "ibuprofen",
        34334: "ice",
        34335: "iciness",
        34336: "icing",
        34341: "icky",
        34342: "icon",
        34343: "icy",
        34344: "idealism",
        34345: "idealist",
        34346: "idealize",
        34351: "ideally",
        34352: "idealness",
        34353: "identical",
        34354: "identify",
        34355: "identity",
        34356: "ideology",
        34361: "idiocy",
        34362: "idiom",
        34363: "idly",
        34364: "igloo",
        34365: "ignition",
        34366: "ignore",
        34411: "iguana",
        34412: "illicitly",
        34413: "illusion",
        34414: "illusive",
        34415: "image",
        34416: "imaginary",
        34421: "imagines",
        34422: "imaging",
        34423: "imbecile",
        34424: "imitate",
        34425: "imitation",
        34426: "immature",
        34431: "immerse",
        34432: "immersion",
        34433: "imminent",
        34434: "immobile",
        34435: "immodest",
        34436: "immorally",
        34441: "immortal",
        34442: "immovable",
        34443: "immovably",
        34444: "immunity",
        34445: "immunize",
        34446: "impaired",
        34451: "impale",
        34452: "impart",
        34453: "impatient",
        34454: "impeach",
        34455: "impeding",
        34456: "impending",
        34461: "imperfect",
        34462: "imperial",
        34463: "impish",
        34464: "implant",
        34465: "implement",
        34466: "implicate",
        34511: "implicit",
        34512: "implode",
        34513: "implosion",
        34514: "implosive",
        34515: "imply",
        34516: "impolite",
        34521: "important",
        34522: "importer",
        34523: "impose",
        34524: "imposing",
        34525: "impotence",
        34526: "impotency",
        34531: "impotent",
        34532: "impound",
        34533: "imprecise",
        34534: "imprint",
        34535: "imprison",
        34536: "impromptu",
        34541: "improper",
        34542: "improve",
        34543: "improving",
        34544: "improvise",
        34545: "imprudent",
        34546: "impulse",
        34551: "impulsive",
        34552: "impure",
        34553: "impurity",
        34554: "iodine",
        34555: "iodize",
        34556: "ion",
        34561: "ipad",
        34562: "iphone",
        34563: "ipod",
        34564: "irate",
        34565: "irk",
        34566: "iron",
        34611: "irregular",
        34612: "irrigate",
        34613: "irritable",
        34614: "irritably",
        34615: "irritant",
        34616: "irritate",
        34621: "islamic",
        34622: "islamist",
        34623: "isolated",
        34624: "isolating",
        34625: "isolation",
        34626: "isotope",
        34631: "issue",
        34632: "issuing",
        34633: "italicize",
        34634: "italics",
        34635: "item",
        34636: "itinerary",
        34641: "itunes",
        34642: "ivory",
        34643: "ivy",
        34644: "jab",
        34645: "jackal",
        34646: "jacket",
        34651: "jackknife",
        34652: "jackpot",
        34653: "jailbird",
        34654: "jailbreak",
        34655: "jailer",
        34656: "jailhouse",
        34661: "jalapeno",
        34662: "jam",
        34663: "janitor",
        34664: "january",
        34665: "jargon",
        34666: "jarring",
        35111: "jasmine",
        35112: "jaundice",
        35113: "jaunt",
        35114: "java",
        35115: "jawed",
        35116: "jawless",
        35121: "jawline",
        35122: "jaws",
        35123: "jaybird",
        35124: "jaywalker",
        35125: "jazz",
        35126: "jeep",
        35131: "jeeringly",
        35132: "jellied",
        35133: "jelly",
        35134: "jersey",
        35135: "jester",
        35136: "jet",
        35141: "jiffy",
        35142: "jigsaw",
        35143: "jimmy",
        35144: "jingle",
        35145: "jingling",
        35146: "jinx",
        35151: "jitters",
        35152: "jittery",
        35153: "job",
        35154: "jockey",
        35155: "jockstrap",
        35156: "jogger",
        35161: "jogging",
        35162: "john",
        35163: "joining",
        35164: "jokester",
        35165: "jokingly",
        35166: "jolliness",
        35211: "jolly",
        35212: "jolt",
        35213: "jot",
        35214: "jovial",
        35215: "joyfully",
        35216: "joylessly",
        35221: "joyous",
        35222: "joyride",
        35223: "joystick",
        35224: "jubilance",
        35225: "jubilant",
        35226: "judge",
        35231: "judgingly",
        35232: "judicial",
        35233: "judiciary",
        35234: "judo",
        35235: "juggle",
        35236: "juggling",
        35241: "jugular",
        35242: "juice",
        35243: "juiciness",
        35244: "juicy",
        35245: "jujitsu",
        35246: "jukebox",
        35251: "july",
        35252: "jumble",
        35253: "jumbo",
        35254: "jump",
        35255: "junction",
        35256: "juncture",
        35261: "june",
        35262: "junior",
        35263: "juniper",
        35264: "junkie",
        35265: "junkman",
        35266: "junkyard",
        35311: "jurist",
        35312: "juror",
        35313: "jury",
        35314: "justice",
        35315: "justifier",
        35316: "justify",
        35321: "justly",
        35322: "justness",
        35323: "juvenile",
        35324: "kabob",
        35325: "kangaroo",
        35326: "karaoke",
        35331: "karate",
        35332: "karma",
        35333: "kebab",
        35334: "keenly",
        35335: "keenness",
        35336: "keep",
        35341: "keg",
        35342: "kelp",
        35343: "kennel",
        35344: "kept",
        35345: "kerchief",
        35346: "kerosene",
        35351: "kettle",
        35352: "kick",
        35353: "kiln",
        35354: "kilobyte",
        35355: "kilogram",
        35356: "kilometer",
        35361: "kilowatt",
        35362: "kilt",
        35363: "kimono",
        35364: "kindle",
        35365: "kindling",
        35366: "kindly",
        35411: "kindness",
        35412: "kindred",
        35413: "kinetic",
        35414: "kinfolk",
        35415: "king",
        35416: "kinship",
        35421: "kinsman",
        35422: "kinswoman",
        35423: "kissable",
        35424: "kisser",
        35425: "kissing",
        35426: "kitchen",
        35431: "kite",
        35432: "kitten",
        35433: "kitty",
        35434: "kiwi",
        35435: "kleenex",
        35436: "knapsack",
        35441: "knee",
        35442: "knelt",
        35443: "knickers",
        35444: "knoll",
        35445: "koala",
        35446: "kooky",
        35451: "kosher",
        35452: "krypton",
        35453: "kudos",
        35454: "kung",
        35455: "labored",
        35456: "laborer",
        35461: "laboring",
        35462: "laborious",
        35463: "labrador",
        35464: "ladder",
        35465: "ladies",
        35466: "ladle",
        35511: "ladybug",
        35512: "ladylike",
        35513: "lagged",
        35514: "lagging",
        35515: "lagoon",
        35516: "lair",
        35521: "lake",
        35522: "lance",
        35523: "landed",
        35524: "landfall",
        35525: "landfill",
        35526: "landing",
        35531: "landlady",
        35532: "landless",
        35533: "landline",
        35534: "landlord",
        35535: "landmark",
        35536: "landmass",
        35541: "landmine",
        35542: "landowner",
        35543: "landscape",
        35544: "landside",
        35545: "landslide",
        35546: "language",
        35551: "lankiness",
        35552: "lanky",
        35553: "lantern",
        35554: "lapdog",
        35555: "lapel",
        35556: "lapped",
        35561: "lapping",
        35562: "laptop",
        35563: "lard",
        35564: "large",
        35565: "lark",
        35566: "lash",
        35611: "lasso",
        35612: "last",
        35613: "latch",
        35614: "late",
        35615: "lather",
        35616: "latitude",
        35621: "latrine",
        35622: "latter",
        35623: "latticed",
        35624: "launch",
        35625: "launder",
        35626: "laundry",
        35631: "laurel",
        35632: "lavender",
        35633: "lavish",
        35634: "laxative",
        35635: "lazily",
        35636: "laziness",
        35641: "lazy",
        35642: "lecturer",
        35643: "left",
        35644: "legacy",
        35645: "legal",
        35646: "legend",
        35651: "legged",
        35652: "leggings",
        35653: "legible",
        35654: "legibly",
        35655: "legislate",
        35656: "lego",
        35661: "legroom",
        35662: "legume",
        35663: "legwarmer",
        35664: "legwork",
        35665: "lemon",
        35666: "lend",
        36111: "length",
        36112: "lens",
        36113: "lent",
        36114: "leotard",
        36115: "lesser",
        36116: "letdown",
        36121: "lethargic",
        36122: "lethargy",
        36123: "letter",
        36124: "lettuce",
        36125: "level",
        36126: "leverage",
        36131: "levers",
        36132: "levitate",
        36133: "levitator",
        36134: "liability",
        36135: "liable",
        36136: "liberty",
        36141: "librarian",
        36142: "library",
        36143: "licking",
        36144: "licorice",
        36145: "lid",
        36146: "life",
        36151: "lifter",
        36152: "lifting",
        36153: "liftoff",
        36154: "ligament",
        36155: "likely",
        36156: "likeness",
        36161: "likewise",
        36162: "liking",
        36163: "lilac",
        36164: "lilly",
        36165: "lily",
        36166: "limb",
        36211: "limeade",
        36212: "limelight",
        36213: "limes",
        36214: "limit",
        36215: "limping",
        36216: "limpness",
        36221: "line",
        36222: "lingo",
        36223: "linguini",
        36224: "linguist",
        36225: "lining",
        36226: "linked",
        36231: "linoleum",
        36232: "linseed",
        36233: "lint",
        36234: "lion",
        36235: "lip",
        36236: "liquefy",
        36241: "liqueur",
        36242: "liquid",
        36243: "lisp",
        36244: "list",
        36245: "litigate",
        36246: "litigator",
        36251: "litmus",
        36252: "litter",
        36253: "little",
        36254: "livable",
        36255: "lived",
        36256: "lively",
        36261: "liver",
        36262: "livestock",
        36263: "lividly",
        36264: "living",
        36265: "lizard",
        36266: "lubricant",
        36311: "lubricate",
        36312: "lucid",
        36313: "luckily",
        36314: "luckiness",
        36315: "luckless",
        36316: "lucrative",
        36321: "ludicrous",
        36322: "lugged",
        36323: "lukewarm",
        36324: "lullaby",
        36325: "lumber",
        36326: "luminance",
        36331: "luminous",
        36332: "lumpiness",
        36333: "lumping",
        36334: "lumpish",
        36335: "lunacy",
        36336: "lunar",
        36341: "lunchbox",
        36342: "luncheon",
        36343: "lunchroom",
        36344: "lunchtime",
        36345: "lung",
        36346: "lurch",
        36351: "lure",
        36352: "luridness",
        36353: "lurk",
        36354: "lushly",
        36355: "lushness",
        36356: "luster",
        36361: "lustfully",
        36362: "lustily",
        36363: "lustiness",
        36364: "lustrous",
        36365: "lusty",
        36366: "luxurious",
        36411: "luxury",
        36412: "lying",
        36413: "lyrically",
        36414: "lyricism",
        36415: "lyricist",
        36416: "lyrics",
        36421: "macarena",
        36422: "macaroni",
        36423: "macaw",
        36424: "mace",
        36425: "machine",
        36426: "machinist",
        36431: "magazine",
        36432: "magenta",
        36433: "maggot",
        36434: "magical",
        36435: "magician",
        36436: "magma",
        36441: "magnesium",
        36442: "magnetic",
        36443: "magnetism",
        36444: "magnetize",
        36445: "magnifier",
        36446: "magnify",
        36451: "magnitude",
        36452: "magnolia",
        36453: "mahogany",
        36454: "maimed",
        36455: "majestic",
        36456: "majesty",
        36461: "majorette",
        36462: "majority",
        36463: "makeover",
        36464: "maker",
        36465: "makeshift",
        36466: "making",
        36511: "malformed",
        36512: "malt",
        36513: "mama",
        36514: "mammal",
        36515: "mammary",
        36516: "mammogram",
        36521: "manager",
        36522: "managing",
        36523: "manatee",
        36524: "mandarin",
        36525: "mandate",
        36526: "mandatory",
        36531: "mandolin",
        36532: "manger",
        36533: "mangle",
        36534: "mango",
        36535: "mangy",
        36536: "manhandle",
        36541: "manhole",
        36542: "manhood",
        36543: "manhunt",
        36544: "manicotti",
        36545: "manicure",
        36546: "manifesto",
        36551: "manila",
        36552: "mankind",
        36553: "manlike",
        36554: "manliness",
        36555: "manly",
        36556: "manmade",
        36561: "manned",
        36562: "mannish",
        36563: "manor",
        36564: "manpower",
        36565: "mantis",
        36566: "mantra",
        36611: "manual",
        36612: "many",
        36613: "map",
        36614: "marathon",
        36615: "marauding",
        36616: "marbled",
        36621: "marbles",
        36622: "marbling",
        36623: "march",
        36624: "mardi",
        36625: "margarine",
        36626: "margarita",
        36631: "margin",
        36632: "marigold",
        36633: "marina",
        36634: "marine",
        36635: "marital",
        36636: "maritime",
        36641: "marlin",
        36642: "marmalade",
        36643: "maroon",
        36644: "married",
        36645: "marrow",
        36646: "marry",
        36651: "marshland",
        36652: "marshy",
        36653: "marsupial",
        36654: "marvelous",
        36655: "marxism",
        36656: "mascot",
        36661: "masculine",
        36662: "mashed",
        36663: "mashing",
        36664: "massager",
        36665: "masses",
        36666: "massive",
        41111: "mastiff",
        41112: "matador",
        41113: "matchbook",
        41114: "matchbox",
        41115: "matcher",
        41116: "matching",
        41121: "matchless",
        41122: "material",
        41123: "maternal",
        41124: "maternity",
        41125: "math",
        41126: "mating",
        41131: "matriarch",
        41132: "matrimony",
        41133: "matrix",
        41134: "matron",
        41135: "matted",
        41136: "matter",
        41141: "maturely",
        41142: "maturing",
        41143: "maturity",
        41144: "mauve",
        41145: "maverick",
        41146: "maximize",
        41151: "maximum",
        41152: "maybe",
        41153: "mayday",
        41154: "mayflower",
        41155: "moaner",
        41156: "moaning",
        41161: "mobile",
        41162: "mobility",
        41163: "mobilize",
        41164: "mobster",
        41165: "mocha",
        41166: "mocker",
        41211: "mockup",
        41212: "modified",
        41213: "modify",
        41214: "modular",
        41215: "modulator",
        41216: "module",
        41221: "moisten",
        41222: "moistness",
        41223: "moisture",
        41224: "molar",
        41225: "molasses",
        41226: "mold",
        41231: "molecular",
        41232: "molecule",
        41233: "molehill",
        41234: "mollusk",
        41235: "mom",
        41236: "monastery",
        41241: "monday",
        41242: "monetary",
        41243: "monetize",
        41244: "moneybags",
        41245: "moneyless",
        41246: "moneywise",
        41251: "mongoose",
        41252: "mongrel",
        41253: "monitor",
        41254: "monkhood",
        41255: "monogamy",
        41256: "monogram",
        41261: "monologue",
        41262: "monopoly",
        41263: "monorail",
        41264: "monotone",
        41265: "monotype",
        41266: "monoxide",
        41311: "monsieur",
        41312: "monsoon",
        41313: "monstrous",
        41314: "monthly",
        41315: "monument",
        41316: "moocher",
        41321: "moodiness",
        41322: "moody",
        41323: "mooing",
        41324: "moonbeam",
        41325: "mooned",
        41326: "moonlight",
        41331: "moonlike",
        41332: "moonlit",
        41333: "moonrise",
        41334: "moonscape",
        41335: "moonshine",
        41336: "moonstone",
        41341: "moonwalk",
        41342: "mop",
        41343: "morale",
        41344: "morality",
        41345: "morally",
        41346: "morbidity",
        41351: "morbidly",
        41352: "morphine",
        41353: "morphing",
        41354: "morse",
        41355: "mortality",
        41356: "mortally",
        41361: "mortician",
        41362: "mortified",
        41363: "mortify",
        41364: "mortuary",
        41365: "mosaic",
        41366: "mossy",
        41411: "most",
        41412: "mothball",
        41413: "mothproof",
        41414: "motion",
        41415: "motivate",
        41416: "motivator",
        41421: "motive",
        41422: "motocross",
        41423: "motor",
        41424: "motto",
        41425: "mountable",
        41426: "mountain",
        41431: "mounted",
        41432: "mounting",
        41433: "mourner",
        41434: "mournful",
        41435: "mouse",
        41436: "mousiness",
        41441: "moustache",
        41442: "mousy",
        41443: "mouth",
        41444: "movable",
        41445: "move",
        41446: "movie",
        41451: "moving",
        41452: "mower",
        41453: "mowing",
        41454: "much",
        41455: "muck",
        41456: "mud",
        41461: "mug",
        41462: "mulberry",
        41463: "mulch",
        41464: "mule",
        41465: "mulled",
        41466: "mullets",
        41511: "multiple",
        41512: "multiply",
        41513: "multitask",
        41514: "multitude",
        41515: "mumble",
        41516: "mumbling",
        41521: "mumbo",
        41522: "mummified",
        41523: "mummify",
        41524: "mummy",
        41525: "mumps",
        41526: "munchkin",
        41531: "mundane",
        41532: "municipal",
        41533: "muppet",
        41534: "mural",
        41535: "murkiness",
        41536: "murky",
        41541: "murmuring",
        41542: "muscular",
        41543: "museum",
        41544: "mushily",
        41545: "mushiness",
        41546: "mushroom",
        41551: "mushy",
        41552: "music",
        41553: "musket",
        41554: "muskiness",
        41555: "musky",
        41556: "mustang",
        41561: "mustard",
        41562: "muster",
        41563: "mustiness",
        41564: "musty",
        41565: "mutable",
        41566: "mutate",
        41611: "mutation",
        41612: "mute",
        41613: "mutilated",
        41614: "mutilator",
        41615: "mutiny",
        41616: "mutt",
        41621: "mutual",
        41622: "muzzle",
        41623: "myself",
        41624: "myspace",
        41625: "mystified",
        41626: "mystify",
        41631: "myth",
        41632: "nacho",
        41633: "nag",
        41634: "nail",
        41635: "name",
        41636: "naming",
        41641: "nanny",
        41642: "nanometer",
        41643: "nape",
        41644: "napkin",
        41645: "napped",
        41646: "napping",
        41651: "nappy",
        41652: "narrow",
        41653: "nastily",
        41654: "nastiness",
        41655: "national",
        41656: "native",
        41661: "nativity",
        41662: "natural",
        41663: "nature",
        41664: "naturist",
        41665: "nautical",
        41666: "navigate",
        42111: "navigator",
        42112: "navy",
        42113: "nearby",
        42114: "nearest",
        42115: "nearly",
        42116: "nearness",
        42121: "neatly",
        42122: "neatness",
        42123: "nebula",
        42124: "nebulizer",
        42125: "nectar",
        42126: "negate",
        42131: "negation",
        42132: "negative",
        42133: "neglector",
        42134: "negligee",
        42135: "negligent",
        42136: "negotiate",
        42141: "nemeses",
        42142: "nemesis",
        42143: "neon",
        42144: "nephew",
        42145: "nerd",
        42146: "nervous",
        42151: "nervy",
        42152: "nest",
        42153: "net",
        42154: "neurology",
        42155: "neuron",
        42156: "neurosis",
        42161: "neurotic",
        42162: "neuter",
        42163: "neutron",
        42164: "never",
        42165: "next",
        42166: "nibble",
        42211: "nickname",
        42212: "nicotine",
        42213: "niece",
        42214: "nifty",
        42215: "nimble",
        42216: "nimbly",
        42221: "nineteen",
        42222: "ninetieth",
        42223: "ninja",
        42224: "nintendo",
        42225: "ninth",
        42226: "nuclear",
        42231: "nuclei",
        42232: "nucleus",
        42233: "nugget",
        42234: "nullify",
        42235: "number",
        42236: "numbing",
        42241: "numbly",
        42242: "numbness",
        42243: "numeral",
        42244: "numerate",
        42245: "numerator",
        42246: "numeric",
        42251: "numerous",
        42252: "nuptials",
        42253: "nursery",
        42254: "nursing",
        42255: "nurture",
        42256: "nutcase",
        42261: "nutlike",
        42262: "nutmeg",
        42263: "nutrient",
        42264: "nutshell",
        42265: "nuttiness",
        42266: "nutty",
        42311: "nuzzle",
        42312: "nylon",
        42313: "oaf",
        42314: "oak",
        42315: "oasis",
        42316: "oat",
        42321: "obedience",
        42322: "obedient",
        42323: "obituary",
        42324: "object",
        42325: "obligate",
        42326: "obliged",
        42331: "oblivion",
        42332: "oblivious",
        42333: "oblong",
        42334: "obnoxious",
        42335: "oboe",
        42336: "obscure",
        42341: "obscurity",
        42342: "observant",
        42343: "observer",
        42344: "observing",
        42345: "obsessed",
        42346: "obsession",
        42351: "obsessive",
        42352: "obsolete",
        42353: "obstacle",
        42354: "obstinate",
        42355: "obstruct",
        42356: "obtain",
        42361: "obtrusive",
        42362: "obtuse",
        42363: "obvious",
        42364: "occultist",
        42365: "occupancy",
        42366: "occupant",
        42411: "occupier",
        42412: "occupy",
        42413: "ocean",
        42414: "ocelot",
        42415: "octagon",
        42416: "octane",
        42421: "october",
        42422: "octopus",
        42423: "ogle",
        42424: "oil",
        42425: "oink",
        42426: "ointment",
        42431: "okay",
        42432: "old",
        42433: "olive",
        42434: "olympics",
        42435: "omega",
        42436: "omen",
        42441: "ominous",
        42442: "omission",
        42443: "omit",
        42444: "omnivore",
        42445: "onboard",
        42446: "oncoming",
        42451: "ongoing",
        42452: "onion",
        42453: "online",
        42454: "onlooker",
        42455: "only",
        42456: "onscreen",
        42461: "onset",
        42462: "onshore",
        42463: "onslaught",
        42464: "onstage",
        42465: "onto",
        42466: "onward",
        42511: "onyx",
        42512: "oops",
        42513: "ooze",
        42514: "oozy",
        42515: "opacity",
        42516: "opal",
        42521: "open",
        42522: "operable",
        42523: "operate",
        42524: "operating",
        42525: "operation",
        42526: "operative",
        42531: "operator",
        42532: "opium",
        42533: "opossum",
        42534: "opponent",
        42535: "oppose",
        42536: "opposing",
        42541: "opposite",
        42542: "oppressed",
        42543: "oppressor",
        42544: "opt",
        42545: "opulently",
        42546: "osmosis",
        42551: "other",
        42552: "otter",
        42553: "ouch",
        42554: "ought",
        42555: "ounce",
        42556: "outage",
        42561: "outback",
        42562: "outbid",
        42563: "outboard",
        42564: "outbound",
        42565: "outbreak",
        42566: "outburst",
        42611: "outcast",
        42612: "outclass",
        42613: "outcome",
        42614: "outdated",
        42615: "outdoors",
        42616: "outer",
        42621: "outfield",
        42622: "outfit",
        42623: "outflank",
        42624: "outgoing",
        42625: "outgrow",
        42626: "outhouse",
        42631: "outing",
        42632: "outlast",
        42633: "outlet",
        42634: "outline",
        42635: "outlook",
        42636: "outlying",
        42641: "outmatch",
        42642: "outmost",
        42643: "outnumber",
        42644: "outplayed",
        42645: "outpost",
        42646: "outpour",
        42651: "output",
        42652: "outrage",
        42653: "outrank",
        42654: "outreach",
        42655: "outright",
        42656: "outscore",
        42661: "outsell",
        42662: "outshine",
        42663: "outshoot",
        42664: "outsider",
        42665: "outskirts",
        42666: "outsmart",
        43111: "outsource",
        43112: "outspoken",
        43113: "outtakes",
        43114: "outthink",
        43115: "outward",
        43116: "outweigh",
        43121: "outwit",
        43122: "oval",
        43123: "ovary",
        43124: "oven",
        43125: "overact",
        43126: "overall",
        43131: "overarch",
        43132: "overbid",
        43133: "overbill",
        43134: "overbite",
        43135: "overblown",
        43136: "overboard",
        43141: "overbook",
        43142: "overbuilt",
        43143: "overcast",
        43144: "overcoat",
        43145: "overcome",
        43146: "overcook",
        43151: "overcrowd",
        43152: "overdraft",
        43153: "overdrawn",
        43154: "overdress",
        43155: "overdrive",
        43156: "overdue",
        43161: "overeager",
        43162: "overeater",
        43163: "overexert",
        43164: "overfed",
        43165: "overfeed",
        43166: "overfill",
        43211: "overflow",
        43212: "overfull",
        43213: "overgrown",
        43214: "overhand",
        43215: "overhang",
        43216: "overhaul",
        43221: "overhead",
        43222: "overhear",
        43223: "overheat",
        43224: "overhung",
        43225: "overjoyed",
        43226: "overkill",
        43231: "overlabor",
        43232: "overlaid",
        43233: "overlap",
        43234: "overlay",
        43235: "overload",
        43236: "overlook",
        43241: "overlord",
        43242: "overlying",
        43243: "overnight",
        43244: "overpass",
        43245: "overpay",
        43246: "overplant",
        43251: "overplay",
        43252: "overpower",
        43253: "overprice",
        43254: "overrate",
        43255: "overreach",
        43256: "overreact",
        43261: "override",
        43262: "overripe",
        43263: "overrule",
        43264: "overrun",
        43265: "overshoot",
        43266: "overshot",
        43311: "oversight",
        43312: "oversized",
        43313: "oversleep",
        43314: "oversold",
        43315: "overspend",
        43316: "overstate",
        43321: "overstay",
        43322: "overstep",
        43323: "overstock",
        43324: "overstuff",
        43325: "oversweet",
        43326: "overtake",
        43331: "overthrow",
        43332: "overtime",
        43333: "overtly",
        43334: "overtone",
        43335: "overture",
        43336: "overturn",
        43341: "overuse",
        43342: "overvalue",
        43343: "overview",
        43344: "overwrite",
        43345: "owl",
        43346: "oxford",
        43351: "oxidant",
        43352: "oxidation",
        43353: "oxidize",
        43354: "oxidizing",
        43355: "oxygen",
        43356: "oxymoron",
        43361: "oyster",
        43362: "ozone",
        43363: "paced",
        43364: "pacemaker",
        43365: "pacific",
        43366: "pacifier",
        43411: "pacifism",
        43412: "pacifist",
        43413: "pacify",
        43414: "padded",
        43415: "padding",
        43416: "paddle",
        43421: "paddling",
        43422: "padlock",
        43423: "pagan",
        43424: "pager",
        43425: "paging",
        43426: "pajamas",
        43431: "palace",
        43432: "palatable",
        43433: "palm",
        43434: "palpable",
        43435: "palpitate",
        43436: "paltry",
        43441: "pampered",
        43442: "pamperer",
        43443: "pampers",
        43444: "pamphlet",
        43445: "panama",
        43446: "pancake",
        43451: "pancreas",
        43452: "panda",
        43453: "pandemic",
        43454: "pang",
        43455: "panhandle",
        43456: "panic",
        43461: "panning",
        43462: "panorama",
        43463: "panoramic",
        43464: "panther",
        43465: "pantomime",
        43466: "pantry",
        43511: "pants",
        43512: "pantyhose",
        43513: "paparazzi",
        43514: "papaya",
        43515: "paper",
        43516: "paprika",
        43521: "papyrus",
        43522: "parabola",
        43523: "parachute",
        43524: "parade",
        43525: "paradox",
        43526: "paragraph",
        43531: "parakeet",
        43532: "paralegal",
        43533: "paralyses",
        43534: "paralysis",
        43535: "paralyze",
        43536: "paramedic",
        43541: "parameter",
        43542: "paramount",
        43543: "parasail",
        43544: "parasite",
        43545: "parasitic",
        43546: "parcel",
        43551: "parched",
        43552: "parchment",
        43553: "pardon",
        43554: "parish",
        43555: "parka",
        43556: "parking",
        43561: "parkway",
        43562: "parlor",
        43563: "parmesan",
        43564: "parole",
        43565: "parrot",
        43566: "parsley",
        43611: "parsnip",
        43612: "partake",
        43613: "parted",
        43614: "parting",
        43615: "partition",
        43616: "partly",
        43621: "partner",
        43622: "partridge",
        43623: "party",
        43624: "passable",
        43625: "passably",
        43626: "passage",
        43631: "passcode",
        43632: "passenger",
        43633: "passerby",
        43634: "passing",
        43635: "passion",
        43636: "passive",
        43641: "passivism",
        43642: "passover",
        43643: "passport",
        43644: "password",
        43645: "pasta",
        43646: "pasted",
        43651: "pastel",
        43652: "pastime",
        43653: "pastor",
        43654: "pastrami",
        43655: "pasture",
        43656: "pasty",
        43661: "patchwork",
        43662: "patchy",
        43663: "paternal",
        43664: "paternity",
        43665: "path",
        43666: "patience",
        44111: "patient",
        44112: "patio",
        44113: "patriarch",
        44114: "patriot",
        44115: "patrol",
        44116: "patronage",
        44121: "patronize",
        44122: "pauper",
        44123: "pavement",
        44124: "paver",
        44125: "pavestone",
        44126: "pavilion",
        44131: "paving",
        44132: "pawing",
        44133: "payable",
        44134: "payback",
        44135: "paycheck",
        44136: "payday",
        44141: "payee",
        44142: "payer",
        44143: "paying",
        44144: "payment",
        44145: "payphone",
        44146: "payroll",
        44151: "pebble",
        44152: "pebbly",
        44153: "pecan",
        44154: "pectin",
        44155: "peculiar",
        44156: "peddling",
        44161: "pediatric",
        44162: "pedicure",
        44163: "pedigree",
        44164: "pedometer",
        44165: "pegboard",
        44166: "pelican",
        44211: "pellet",
        44212: "pelt",
        44213: "pelvis",
        44214: "penalize",
        44215: "penalty",
        44216: "pencil",
        44221: "pendant",
        44222: "pending",
        44223: "penholder",
        44224: "penknife",
        44225: "pennant",
        44226: "penniless",
        44231: "penny",
        44232: "penpal",
        44233: "pension",
        44234: "pentagon",
        44235: "pentagram",
        44236: "pep",
        44241: "perceive",
        44242: "percent",
        44243: "perch",
        44244: "percolate",
        44245: "perennial",
        44246: "perfected",
        44251: "perfectly",
        44252: "perfume",
        44253: "periscope",
        44254: "perish",
        44255: "perjurer",
        44256: "perjury",
        44261: "perkiness",
        44262: "perky",
        44263: "perm",
        44264: "peroxide",
        44265: "perpetual",
        44266: "perplexed",
        44311: "persecute",
        44312: "persevere",
        44313: "persuaded",
        44314: "persuader",
        44315: "pesky",
        44316: "peso",
        44321: "pessimism",
        44322: "pessimist",
        44323: "pester",
        44324: "pesticide",
        44325: "petal",
        44326: "petite",
        44331: "petition",
        44332: "petri",
        44333: "petroleum",
        44334: "petted",
        44335: "petticoat",
        44336: "pettiness",
        44341: "petty",
        44342: "petunia",
        44343: "phantom",
        44344: "phobia",
        44345: "phoenix",
        44346: "phonebook",
        44351: "phoney",
        44352: "phonics",
        44353: "phoniness",
        44354: "phony",
        44355: "phosphate",
        44356: "photo",
        44361: "phrase",
        44362: "phrasing",
        44363: "placard",
        44364: "placate",
        44365: "placidly",
        44366: "plank",
        44411: "planner",
        44412: "plant",
        44413: "plasma",
        44414: "plaster",
        44415: "plastic",
        44416: "plated",
        44421: "platform",
        44422: "plating",
        44423: "platinum",
        44424: "platonic",
        44425: "platter",
        44426: "platypus",
        44431: "plausible",
        44432: "plausibly",
        44433: "playable",
        44434: "playback",
        44435: "player",
        44436: "playful",
        44441: "playgroup",
        44442: "playhouse",
        44443: "playing",
        44444: "playlist",
        44445: "playmaker",
        44446: "playmate",
        44451: "playoff",
        44452: "playpen",
        44453: "playroom",
        44454: "playset",
        44455: "plaything",
        44456: "playtime",
        44461: "plaza",
        44462: "pleading",
        44463: "pleat",
        44464: "pledge",
        44465: "plentiful",
        44466: "plenty",
        44511: "plethora",
        44512: "plexiglas",
        44513: "pliable",
        44514: "plod",
        44515: "plop",
        44516: "plot",
        44521: "plow",
        44522: "ploy",
        44523: "pluck",
        44524: "plug",
        44525: "plunder",
        44526: "plunging",
        44531: "plural",
        44532: "plus",
        44533: "plutonium",
        44534: "plywood",
        44535: "poach",
        44536: "pod",
        44541: "poem",
        44542: "poet",
        44543: "pogo",
        44544: "pointed",
        44545: "pointer",
        44546: "pointing",
        44551: "pointless",
        44552: "pointy",
        44553: "poise",
        44554: "poison",
        44555: "poker",
        44556: "poking",
        44561: "polar",
        44562: "police",
        44563: "policy",
        44564: "polio",
        44565: "polish",
        44566: "politely",
        44611: "polka",
        44612: "polo",
        44613: "polyester",
        44614: "polygon",
        44615: "polygraph",
        44616: "polymer",
        44621: "poncho",
        44622: "pond",
        44623: "pony",
        44624: "popcorn",
        44625: "pope",
        44626: "poplar",
        44631: "popper",
        44632: "poppy",
        44633: "popsicle",
        44634: "populace",
        44635: "popular",
        44636: "populate",
        44641: "porcupine",
        44642: "pork",
        44643: "porous",
        44644: "porridge",
        44645: "portable",
        44646: "portal",
        44651: "portfolio",
        44652: "porthole",
        44653: "portion",
        44654: "portly",
        44655: "portside",
        44656: "poser",
        44661: "posh",
        44662: "posing",
        44663: "possible",
        44664: "possibly",
        44665: "possum",
        44666: "postage",
        45111: "postal",
        45112: "postbox",
        45113: "postcard",
        45114: "posted",
        45115: "poster",
        45116: "posting",
        45121: "postnasal",
        45122: "posture",
        45123: "postwar",
        45124: "pouch",
        45125: "pounce",
        45126: "pouncing",
        45131: "pound",
        45132: "pouring",
        45133: "pout",
        45134: "powdered",
        45135: "powdering",
        45136: "powdery",
        45141: "power",
        45142: "powwow",
        45143: "pox",
        45144: "praising",
        45145: "prance",
        45146: "prancing",
        45151: "pranker",
        45152: "prankish",
        45153: "prankster",
        45154: "prayer",
        45155: "praying",
        45156: "preacher",
        45161: "preaching",
        45162: "preachy",
        45163: "preamble",
        45164: "precinct",
        45165: "precise",
        45166: "precision",
        45211: "precook",
        45212: "precut",
        45213: "predator",
        45214: "predefine",
        45215: "predict",
        45216: "preface",
        45221: "prefix",
        45222: "preflight",
        45223: "preformed",
        45224: "pregame",
        45225: "pregnancy",
        45226: "pregnant",
        45231: "preheated",
        45232: "prelaunch",
        45233: "prelaw",
        45234: "prelude",
        45235: "premiere",
        45236: "premises",
        45241: "premium",
        45242: "prenatal",
        45243: "preoccupy",
        45244: "preorder",
        45245: "prepaid",
        45246: "prepay",
        45251: "preplan",
        45252: "preppy",
        45253: "preschool",
        45254: "prescribe",
        45255: "preseason",
        45256: "preset",
        45261: "preshow",
        45262: "president",
        45263: "presoak",
        45264: "press",
        45265: "presume",
        45266: "presuming",
        45311: "preteen",
        45312: "pretended",
        45313: "pretender",
        45314: "pretense",
        45315: "pretext",
        45316: "pretty",
        45321: "pretzel",
        45322: "prevail",
        45323: "prevalent",
        45324: "prevent",
        45325: "preview",
        45326: "previous",
        45331: "prewar",
        45332: "prewashed",
        45333: "prideful",
        45334: "pried",
        45335: "primal",
        45336: "primarily",
        45341: "primary",
        45342: "primate",
        45343: "primer",
        45344: "primp",
        45345: "princess",
        45346: "print",
        45351: "prior",
        45352: "prism",
        45353: "prison",
        45354: "prissy",
        45355: "pristine",
        45356: "privacy",
        45361: "private",
        45362: "privatize",
        45363: "prize",
        45364: "proactive",
        45365: "probable",
        45366: "probably",
        45411: "probation",
        45412: "probe",
        45413: "probing",
        45414: "probiotic",
        45415: "problem",
        45416: "procedure",
        45421: "process",
        45422: "proclaim",
        45423: "procreate",
        45424: "procurer",
        45425: "prodigal",
        45426: "prodigy",
        45431: "produce",
        45432: "product",
        45433: "profane",
        45434: "profanity",
        45435: "professed",
        45436: "professor",
        45441: "profile",
        45442: "profound",
        45443: "profusely",
        45444: "progeny",
        45445: "prognosis",
        45446: "program",
        45451: "progress",
        45452: "projector",
        45453: "prologue",
        45454: "prolonged",
        45455: "promenade",
        45456: "prominent",
        45461: "promoter",
        45462: "promotion",
        45463: "prompter",
        45464: "promptly",
        45465: "prone",
        45466: "prong",
        45511: "pronounce",
        45512: "pronto",
        45513: "proofing",
        45514: "proofread",
        45515: "proofs",
        45516: "propeller",
        45521: "properly",
        45522: "property",
        45523: "proponent",
        45524: "proposal",
        45525: "propose",
        45526: "props",
        45531: "prorate",
        45532: "protector",
        45533: "protegee",
        45534: "proton",
        45535: "prototype",
        45536: "protozoan",
        45541: "protract",
        45542: "protrude",
        45543: "proud",
        45544: "provable",
        45545: "proved",
        45546: "proven",
        45551: "provided",
        45552: "provider",
        45553: "providing",
        45554: "province",
        45555: "proving",
        45556: "provoke",
        45561: "provoking",
        45562: "provolone",
        45563: "prowess",
        45564: "prowler",
        45565: "prowling",
        45566: "proximity",
        45611: "proxy",
        45612: "prozac",
        45613: "prude",
        45614: "prudishly",
        45615: "prune",
        45616: "pruning",
        45621: "pry",
        45622: "psychic",
        45623: "public",
        45624: "publisher",
        45625: "pucker",
        45626: "pueblo",
        45631: "pug",
        45632: "pull",
        45633: "pulmonary",
        45634: "pulp",
        45635: "pulsate",
        45636: "pulse",
        45641: "pulverize",
        45642: "puma",
        45643: "pumice",
        45644: "pummel",
        45645: "punch",
        45646: "punctual",
        45651: "punctuate",
        45652: "punctured",
        45653: "pungent",
        45654: "punisher",
        45655: "punk",
        45656: "pupil",
        45661: "puppet",
        45662: "puppy",
        45663: "purchase",
        45664: "pureblood",
        45665: "purebred",
        45666: "purely",
        46111: "pureness",
        46112: "purgatory",
        46113: "purge",
        46114: "purging",
        46115: "purifier",
        46116: "purify",
        46121: "purist",
        46122: "puritan",
        46123: "purity",
        46124: "purple",
        46125: "purplish",
        46126: "purposely",
        46131: "purr",
        46132: "purse",
        46133: "pursuable",
        46134: "pursuant",
        46135: "pursuit",
        46136: "purveyor",
        46141: "pushcart",
        46142: "pushchair",
        46143: "pusher",
        46144: "pushiness",
        46145: "pushing",
        46146: "pushover",
        46151: "pushpin",
        46152: "pushup",
        46153: "pushy",
        46154: "putdown",
        46155: "putt",
        46156: "puzzle",
        46161: "puzzling",
        46162: "pyramid",
        46163: "pyromania",
        46164: "python",
        46165: "quack",
        46166: "quadrant",
        46211: "quail",
        46212: "quaintly",
        46213: "quake",
        46214: "quaking",
        46215: "qualified",
        46216: "qualifier",
        46221: "qualify",
        46222: "quality",
        46223: "qualm",
        46224: "quantum",
        46225: "quarrel",
        46226: "quarry",
        46231: "quartered",
        46232: "quarterly",
        46233: "quarters",
        46234: "quartet",
        46235: "quench",
        46236: "query",
        46241: "quicken",
        46242: "quickly",
        46243: "quickness",
        46244: "quicksand",
        46245: "quickstep",
        46246: "quiet",
        46251: "quill",
        46252: "quilt",
        46253: "quintet",
        46254: "quintuple",
        46255: "quirk",
        46256: "quit",
        46261: "quiver",
        46262: "quizzical",
        46263: "quotable",
        46264: "quotation",
        46265: "quote",
        46266: "rabid",
        46311: "race",
        46312: "racing",
        46313: "racism",
        46314: "rack",
        46315: "racoon",
        46316: "radar",
        46321: "radial",
        46322: "radiance",
        46323: "radiantly",
        46324: "radiated",
        46325: "radiation",
        46326: "radiator",
        46331: "radio",
        46332: "radish",
        46333: "raffle",
        46334: "raft",
        46335: "rage",
        46336: "ragged",
        46341: "raging",
        46342: "ragweed",
        46343: "raider",
        46344: "railcar",
        46345: "railing",
        46346: "railroad",
        46351: "railway",
        46352: "raisin",
        46353: "rake",
        46354: "raking",
        46355: "rally",
        46356: "ramble",
        46361: "rambling",
        46362: "ramp",
        46363: "ramrod",
        46364: "ranch",
        46365: "rancidity",
        46366: "random",
        46411: "ranged",
        46412: "ranger",
        46413: "ranging",
        46414: "ranked",
        46415: "ranking",
        46416: "ransack",
        46421: "ranting",
        46422: "rants",
        46423: "rare",
        46424: "rarity",
        46425: "rascal",
        46426: "rash",
        46431: "rasping",
        46432: "ravage",
        46433: "raven",
        46434: "ravine",
        46435: "raving",
        46436: "ravioli",
        46441: "ravishing",
        46442: "reabsorb",
        46443: "reach",
        46444: "reacquire",
        46445: "reaction",
        46446: "reactive",
        46451: "reactor",
        46452: "reaffirm",
        46453: "ream",
        46454: "reanalyze",
        46455: "reappear",
        46456: "reapply",
        46461: "reappoint",
        46462: "reapprove",
        46463: "rearrange",
        46464: "rearview",
        46465: "reason",
        46466: "reassign",
        46511: "reassure",
        46512: "reattach",
        46513: "reawake",
        46514: "rebalance",
        46515: "rebate",
        46516: "rebel",
        46521: "rebirth",
        46522: "reboot",
        46523: "reborn",
        46524: "rebound",
        46525: "rebuff",
        46526: "rebuild",
        46531: "rebuilt",
        46532: "reburial",
        46533: "rebuttal",
        46534: "recall",
        46535: "recant",
        46536: "recapture",
        46541: "recast",
        46542: "recede",
        46543: "recent",
        46544: "recess",
        46545: "recharger",
        46546: "recipient",
        46551: "recital",
        46552: "recite",
        46553: "reckless",
        46554: "reclaim",
        46555: "recliner",
        46556: "reclining",
        46561: "recluse",
        46562: "reclusive",
        46563: "recognize",
        46564: "recoil",
        46565: "recollect",
        46566: "recolor",
        46611: "reconcile",
        46612: "reconfirm",
        46613: "reconvene",
        46614: "recopy",
        46615: "record",
        46616: "recount",
        46621: "recoup",
        46622: "recovery",
        46623: "recreate",
        46624: "rectal",
        46625: "rectangle",
        46626: "rectified",
        46631: "rectify",
        46632: "recycled",
        46633: "recycler",
        46634: "recycling",
        46635: "reemerge",
        46636: "reenact",
        46641: "reenter",
        46642: "reentry",
        46643: "reexamine",
        46644: "referable",
        46645: "referee",
        46646: "reference",
        46651: "refill",
        46652: "refinance",
        46653: "refined",
        46654: "refinery",
        46655: "refining",
        46656: "refinish",
        46661: "reflected",
        46662: "reflector",
        46663: "reflex",
        46664: "reflux",
        46665: "refocus",
        46666: "refold",
        51111: "reforest",
        51112: "reformat",
        51113: "reformed",
        51114: "reformer",
        51115: "reformist",
        51116: "refract",
        51121: "refrain",
        51122: "refreeze",
        51123: "refresh",
        51124: "refried",
        51125: "refueling",
        51126: "refund",
        51131: "refurbish",
        51132: "refurnish",
        51133: "refusal",
        51134: "refuse",
        51135: "refusing",
        51136: "refutable",
        51141: "refute",
        51142: "regain",
        51143: "regalia",
        51144: "regally",
        51145: "reggae",
        51146: "regime",
        51151: "region",
        51152: "register",
        51153: "registrar",
        51154: "registry",
        51155: "regress",
        51156: "regretful",
        51161: "regroup",
        51162: "regular",
        51163: "regulate",
        51164: "regulator",
        51165: "rehab",
        51166: "reheat",
        51211: "rehire",
        51212: "rehydrate",
        51213: "reimburse",
        51214: "reissue",
        51215: "reiterate",
        51216: "rejoice",
        51221: "rejoicing",
        51222: "rejoin",
        51223: "rekindle",
        51224: "relapse",
        51225: "relapsing",
        51226: "relatable",
        51231: "related",
        51232: "relation",
        51233: "relative",
        51234: "relax",
        51235: "relay",
        51236: "relearn",
        51241: "release",
        51242: "relenting",
        51243: "reliable",
        51244: "reliably",
        51245: "reliance",
        51246: "reliant",
        51251: "relic",
        51252: "relieve",
        51253: "relieving",
        51254: "relight",
        51255: "relish",
        51256: "relive",
        51261: "reload",
        51262: "relocate",
        51263: "relock",
        51264: "reluctant",
        51265: "rely",
        51266: "remake",
        51311: "remark",
        51312: "remarry",
        51313: "rematch",
        51314: "remedial",
        51315: "remedy",
        51316: "remember",
        51321: "reminder",
        51322: "remindful",
        51323: "remission",
        51324: "remix",
        51325: "remnant",
        51326: "remodeler",
        51331: "remold",
        51332: "remorse",
        51333: "remote",
        51334: "removable",
        51335: "removal",
        51336: "removed",
        51341: "remover",
        51342: "removing",
        51343: "rename",
        51344: "renderer",
        51345: "rendering",
        51346: "rendition",
        51351: "renegade",
        51352: "renewable",
        51353: "renewably",
        51354: "renewal",
        51355: "renewed",
        51356: "renounce",
        51361: "renovate",
        51362: "renovator",
        51363: "rentable",
        51364: "rental",
        51365: "rented",
        51366: "renter",
        51411: "reoccupy",
        51412: "reoccur",
        51413: "reopen",
        51414: "reorder",
        51415: "repackage",
        51416: "repacking",
        51421: "repaint",
        51422: "repair",
        51423: "repave",
        51424: "repaying",
        51425: "repayment",
        51426: "repeal",
        51431: "repeated",
        51432: "repeater",
        51433: "repent",
        51434: "rephrase",
        51435: "replace",
        51436: "replay",
        51441: "replica",
        51442: "reply",
        51443: "reporter",
        51444: "repose",
        51445: "repossess",
        51446: "repost",
        51451: "repressed",
        51452: "reprimand",
        51453: "reprint",
        51454: "reprise",
        51455: "reproach",
        51456: "reprocess",
        51461: "reproduce",
        51462: "reprogram",
        51463: "reps",
        51464: "reptile",
        51465: "reptilian",
        51466: "repugnant",
        51511: "repulsion",
        51512: "repulsive",
        51513: "repurpose",
        51514: "reputable",
        51515: "reputably",
        51516: "request",
        51521: "require",
        51522: "requisite",
        51523: "reroute",
        51524: "rerun",
        51525: "resale",
        51526: "resample",
        51531: "rescuer",
        51532: "reseal",
        51533: "research",
        51534: "reselect",
        51535: "reseller",
        51536: "resemble",
        51541: "resend",
        51542: "resent",
        51543: "reset",
        51544: "reshape",
        51545: "reshoot",
        51546: "reshuffle",
        51551: "residence",
        51552: "residency",
        51553: "resident",
        51554: "residual",
        51555: "residue",
        51556: "resigned",
        51561: "resilient",
        51562: "resistant",
        51563: "resisting",
        51564: "resize",
        51565: "resolute",
        51566: "resolved",
        51611: "resonant",
        51612: "resonate",
        51613: "resort",
        51614: "resource",
        51615: "respect",
        51616: "resubmit",
        51621: "result",
        51622: "resume",
        51623: "resupply",
        51624: "resurface",
        51625: "resurrect",
        51626: "retail",
        51631: "retainer",
        51632: "retaining",
        51633: "retake",
        51634: "retaliate",
        51635: "retention",
        51636: "rethink",
        51641: "retinal",
        51642: "retired",
        51643: "retiree",
        51644: "retiring",
        51645: "retold",
        51646: "retool",
        51651: "retorted",
        51652: "retouch",
        51653: "retrace",
        51654: "retract",
        51655: "retrain",
        51656: "retread",
        51661: "retreat",
        51662: "retrial",
        51663: "retrieval",
        51664: "retriever",
        51665: "retry",
        51666: "return",
        52111: "retying",
        52112: "retype",
        52113: "reunion",
        52114: "reunite",
        52115: "reusable",
        52116: "reuse",
        52121: "reveal",
        52122: "reveler",
        52123: "revenge",
        52124: "revenue",
        52125: "reverb",
        52126: "revered",
        52131: "reverence",
        52132: "reverend",
        52133: "reversal",
        52134: "reverse",
        52135: "reversing",
        52136: "reversion",
        52141: "revert",
        52142: "revisable",
        52143: "revise",
        52144: "revision",
        52145: "revisit",
        52146: "revivable",
        52151: "revival",
        52152: "reviver",
        52153: "reviving",
        52154: "revocable",
        52155: "revoke",
        52156: "revolt",
        52161: "revolver",
        52162: "revolving",
        52163: "reward",
        52164: "rewash",
        52165: "rewind",
        52166: "rewire",
        52211: "reword",
        52212: "rework",
        52213: "rewrap",
        52214: "rewrite",
        52215: "rhyme",
        52216: "ribbon",
        52221: "ribcage",
        52222: "rice",
        52223: "riches",
        52224: "richly",
        52225: "richness",
        52226: "rickety",
        52231: "ricotta",
        52232: "riddance",
        52233: "ridden",
        52234: "ride",
        52235: "riding",
        52236: "rifling",
        52241: "rift",
        52242: "rigging",
        52243: "rigid",
        52244: "rigor",
        52245: "rimless",
        52246: "rimmed",
        52251: "rind",
        52252: "rink",
        52253: "rinse",
        52254: "rinsing",
        52255: "riot",
        52256: "ripcord",
        52261: "ripeness",
        52262: "ripening",
        52263: "ripping",
        52264: "ripple",
        52265: "rippling",
        52266: "riptide",
        52311: "rise",
        52312: "rising",
        52313: "risk",
        52314: "risotto",
        52315: "ritalin",
        52316: "ritzy",
        52321: "rival",
        52322: "riverbank",
        52323: "riverbed",
        52324: "riverboat",
        52325: "riverside",
        52326: "riveter",
        52331: "riveting",
        52332: "roamer",
        52333: "roaming",
        52334: "roast",
        52335: "robbing",
        52336: "robe",
        52341: "robin",
        52342: "robotics",
        52343: "robust",
        52344: "rockband",
        52345: "rocker",
        52346: "rocket",
        52351: "rockfish",
        52352: "rockiness",
        52353: "rocking",
        52354: "rocklike",
        52355: "rockslide",
        52356: "rockstar",
        52361: "rocky",
        52362: "rogue",
        52363: "roman",
        52364: "romp",
        52365: "rope",
        52366: "roping",
        52411: "roster",
        52412: "rosy",
        52413: "rotten",
        52414: "rotting",
        52415: "rotunda",
        52416: "roulette",
        52421: "rounding",
        52422: "roundish",
        52423: "roundness",
        52424: "roundup",
        52425: "roundworm",
        52426: "routine",
        52431: "routing",
        52432: "rover",
        52433: "roving",
        52434: "royal",
        52435: "rubbed",
        52436: "rubber",
        52441: "rubbing",
        52442: "rubble",
        52443: "rubdown",
        52444: "ruby",
        52445: "ruckus",
        52446: "rudder",
        52451: "rug",
        52452: "ruined",
        52453: "rule",
        52454: "rumble",
        52455: "rumbling",
        52456: "rummage",
        52461: "rumor",
        52462: "runaround",
        52463: "rundown",
        52464: "runner",
        52465: "running",
        52466: "runny",
        52511: "runt",
        52512: "runway",
        52513: "rupture",
        52514: "rural",
        52515: "ruse",
        52516: "rush",
        52521: "rust",
        52522: "rut",
        52523: "sabbath",
        52524: "sabotage",
        52525: "sacrament",
        52526: "sacred",
        52531: "sacrifice",
        52532: "sadden",
        52533: "saddlebag",
        52534: "saddled",
        52535: "saddling",
        52536: "sadly",
        52541: "sadness",
        52542: "safari",
        52543: "safeguard",
        52544: "safehouse",
        52545: "safely",
        52546: "safeness",
        52551: "saffron",
        52552: "saga",
        52553: "sage",
        52554: "sagging",
        52555: "saggy",
        52556: "said",
        52561: "saint",
        52562: "sake",
        52563: "salad",
        52564: "salami",
        52565: "salaried",
        52566: "salary",
        52611: "saline",
        52612: "salon",
        52613: "saloon",
        52614: "salsa",
        52615: "salt",
        52616: "salutary",
        52621: "salute",
        52622: "salvage",
        52623: "salvaging",
        52624: "salvation",
        52625: "same",
        52626: "sample",
        52631: "sampling",
        52632: "sanction",
        52633: "sanctity",
        52634: "sanctuary",
        52635: "sandal",
        52636: "sandbag",
        52641: "sandbank",
        52642: "sandbar",
        52643: "sandblast",
        52644: "sandbox",
        52645: "sanded",
        52646: "sandfish",
        52651: "sanding",
        52652: "sandlot",
        52653: "sandpaper",
        52654: "sandpit",
        52655: "sandstone",
        52656: "sandstorm",
        52661: "sandworm",
        52662: "sandy",
        52663: "sanitary",
        52664: "sanitizer",
        52665: "sank",
        52666: "santa",
        53111: "sapling",
        53112: "sappiness",
        53113: "sappy",
        53114: "sarcasm",
        53115: "sarcastic",
        53116: "sardine",
        53121: "sash",
        53122: "sasquatch",
        53123: "sassy",
        53124: "satchel",
        53125: "satiable",
        53126: "satin",
        53131: "satirical",
        53132: "satisfied",
        53133: "satisfy",
        53134: "saturate",
        53135: "saturday",
        53136: "sauciness",
        53141: "saucy",
        53142: "sauna",
        53143: "savage",
        53144: "savanna",
        53145: "saved",
        53146: "savings",
        53151: "savior",
        53152: "savor",
        53153: "saxophone",
        53154: "say",
        53155: "scabbed",
        53156: "scabby",
        53161: "scalded",
        53162: "scalding",
        53163: "scale",
        53164: "scaling",
        53165: "scallion",
        53166: "scallop",
        53211: "scalping",
        53212: "scam",
        53213: "scandal",
        53214: "scanner",
        53215: "scanning",
        53216: "scant",
        53221: "scapegoat",
        53222: "scarce",
        53223: "scarcity",
        53224: "scarecrow",
        53225: "scared",
        53226: "scarf",
        53231: "scarily",
        53232: "scariness",
        53233: "scarring",
        53234: "scary",
        53235: "scavenger",
        53236: "scenic",
        53241: "schedule",
        53242: "schematic",
        53243: "scheme",
        53244: "scheming",
        53245: "schilling",
        53246: "schnapps",
        53251: "scholar",
        53252: "science",
        53253: "scientist",
        53254: "scion",
        53255: "scoff",
        53256: "scolding",
        53261: "scone",
        53262: "scoop",
        53263: "scooter",
        53264: "scope",
        53265: "scorch",
        53266: "scorebook",
        53311: "scorecard",
        53312: "scored",
        53313: "scoreless",
        53314: "scorer",
        53315: "scoring",
        53316: "scorn",
        53321: "scorpion",
        53322: "scotch",
        53323: "scoundrel",
        53324: "scoured",
        53325: "scouring",
        53326: "scouting",
        53331: "scouts",
        53332: "scowling",
        53333: "scrabble",
        53334: "scraggly",
        53335: "scrambled",
        53336: "scrambler",
        53341: "scrap",
        53342: "scratch",
        53343: "scrawny",
        53344: "screen",
        53345: "scribble",
        53346: "scribe",
        53351: "scribing",
        53352: "scrimmage",
        53353: "script",
        53354: "scroll",
        53355: "scrooge",
        53356: "scrounger",
        53361: "scrubbed",
        53362: "scrubber",
        53363: "scruffy",
        53364: "scrunch",
        53365: "scrutiny",
        53366: "scuba",
        53411: "scuff",
        53412: "sculptor",
        53413: "sculpture",
        53414: "scurvy",
        53415: "scuttle",
        53416: "secluded",
        53421: "secluding",
        53422: "seclusion",
        53423: "second",
        53424: "secrecy",
        53425: "secret",
        53426: "sectional",
        53431: "sector",
        53432: "secular",
        53433: "securely",
        53434: "security",
        53435: "sedan",
        53436: "sedate",
        53441: "sedation",
        53442: "sedative",
        53443: "sediment",
        53444: "seduce",
        53445: "seducing",
        53446: "segment",
        53451: "seismic",
        53452: "seizing",
        53453: "seldom",
        53454: "selected",
        53455: "selection",
        53456: "selective",
        53461: "selector",
        53462: "self",
        53463: "seltzer",
        53464: "semantic",
        53465: "semester",
        53466: "semicolon",
        53511: "semifinal",
        53512: "seminar",
        53513: "semisoft",
        53514: "semisweet",
        53515: "senate",
        53516: "senator",
        53521: "send",
        53522: "senior",
        53523: "senorita",
        53524: "sensation",
        53525: "sensitive",
        53526: "sensitize",
        53531: "sensually",
        53532: "sensuous",
        53533: "sepia",
        53534: "september",
        53535: "septic",
        53536: "septum",
        53541: "sequel",
        53542: "sequence",
        53543: "sequester",
        53544: "series",
        53545: "sermon",
        53546: "serotonin",
        53551: "serpent",
        53552: "serrated",
        53553: "serve",
        53554: "service",
        53555: "serving",
        53556: "sesame",
        53561: "sessions",
        53562: "setback",
        53563: "setting",
        53564: "settle",
        53565: "settling",
        53566: "setup",
        53611: "sevenfold",
        53612: "seventeen",
        53613: "seventh",
        53614: "seventy",
        53615: "severity",
        53616: "shabby",
        53621: "shack",
        53622: "shaded",
        53623: "shadily",
        53624: "shadiness",
        53625: "shading",
        53626: "shadow",
        53631: "shady",
        53632: "shaft",
        53633: "shakable",
        53634: "shakily",
        53635: "shakiness",
        53636: "shaking",
        53641: "shaky",
        53642: "shale",
        53643: "shallot",
        53644: "shallow",
        53645: "shame",
        53646: "shampoo",
        53651: "shamrock",
        53652: "shank",
        53653: "shanty",
        53654: "shape",
        53655: "shaping",
        53656: "share",
        53661: "sharpener",
        53662: "sharper",
        53663: "sharpie",
        53664: "sharply",
        53665: "sharpness",
        53666: "shawl",
        54111: "sheath",
        54112: "shed",
        54113: "sheep",
        54114: "sheet",
        54115: "shelf",
        54116: "shell",
        54121: "shelter",
        54122: "shelve",
        54123: "shelving",
        54124: "sherry",
        54125: "shield",
        54126: "shifter",
        54131: "shifting",
        54132: "shiftless",
        54133: "shifty",
        54134: "shimmer",
        54135: "shimmy",
        54136: "shindig",
        54141: "shine",
        54142: "shingle",
        54143: "shininess",
        54144: "shining",
        54145: "shiny",
        54146: "ship",
        54151: "shirt",
        54152: "shivering",
        54153: "shock",
        54154: "shone",
        54155: "shoplift",
        54156: "shopper",
        54161: "shopping",
        54162: "shoptalk",
        54163: "shore",
        54164: "shortage",
        54165: "shortcake",
        54166: "shortcut",
        54211: "shorten",
        54212: "shorter",
        54213: "shorthand",
        54214: "shortlist",
        54215: "shortly",
        54216: "shortness",
        54221: "shorts",
        54222: "shortwave",
        54223: "shorty",
        54224: "shout",
        54225: "shove",
        54226: "showbiz",
        54231: "showcase",
        54232: "showdown",
        54233: "shower",
        54234: "showgirl",
        54235: "showing",
        54236: "showman",
        54241: "shown",
        54242: "showoff",
        54243: "showpiece",
        54244: "showplace",
        54245: "showroom",
        54246: "showy",
        54251: "shrank",
        54252: "shrapnel",
        54253: "shredder",
        54254: "shredding",
        54255: "shrewdly",
        54256: "shriek",
        54261: "shrill",
        54262: "shrimp",
        54263: "shrine",
        54264: "shrink",
        54265: "shrivel",
        54266: "shrouded",
        54311: "shrubbery",
        54312: "shrubs",
        54313: "shrug",
        54314: "shrunk",
        54315: "shucking",
        54316: "shudder",
        54321: "shuffle",
        54322: "shuffling",
        54323: "shun",
        54324: "shush",
        54325: "shut",
        54326: "shy",
        54331: "siamese",
        54332: "siberian",
        54333: "sibling",
        54334: "siding",
        54335: "sierra",
        54336: "siesta",
        54341: "sift",
        54342: "sighing",
        54343: "silenced",
        54344: "silencer",
        54345: "silent",
        54346: "silica",
        54351: "silicon",
        54352: "silk",
        54353: "silliness",
        54354: "silly",
        54355: "silo",
        54356: "silt",
        54361: "silver",
        54362: "similarly",
        54363: "simile",
        54364: "simmering",
        54365: "simple",
        54366: "simplify",
        54411: "simply",
        54412: "sincere",
        54413: "sincerity",
        54414: "singer",
        54415: "singing",
        54416: "single",
        54421: "singular",
        54422: "sinister",
        54423: "sinless",
        54424: "sinner",
        54425: "sinuous",
        54426: "sip",
        54431: "siren",
        54432: "sister",
        54433: "sitcom",
        54434: "sitter",
        54435: "sitting",
        54436: "situated",
        54441: "situation",
        54442: "sixfold",
        54443: "sixteen",
        54444: "sixth",
        54445: "sixties",
        54446: "sixtieth",
        54451: "sixtyfold",
        54452: "sizable",
        54453: "sizably",
        54454: "size",
        54455: "sizing",
        54456: "sizzle",
        54461: "sizzling",
        54462: "skater",
        54463: "skating",
        54464: "skedaddle",
        54465: "skeletal",
        54466: "skeleton",
        54511: "skeptic",
        54512: "sketch",
        54513: "skewed",
        54514: "skewer",
        54515: "skid",
        54516: "skied",
        54521: "skier",
        54522: "skies",
        54523: "skiing",
        54524: "skilled",
        54525: "skillet",
        54526: "skillful",
        54531: "skimmed",
        54532: "skimmer",
        54533: "skimming",
        54534: "skimpily",
        54535: "skincare",
        54536: "skinhead",
        54541: "skinless",
        54542: "skinning",
        54543: "skinny",
        54544: "skintight",
        54545: "skipper",
        54546: "skipping",
        54551: "skirmish",
        54552: "skirt",
        54553: "skittle",
        54554: "skydiver",
        54555: "skylight",
        54556: "skyline",
        54561: "skype",
        54562: "skyrocket",
        54563: "skyward",
        54564: "slab",
        54565: "slacked",
        54566: "slacker",
        54611: "slacking",
        54612: "slackness",
        54613: "slacks",
        54614: "slain",
        54615: "slam",
        54616: "slander",
        54621: "slang",
        54622: "slapping",
        54623: "slapstick",
        54624: "slashed",
        54625: "slashing",
        54626: "slate",
        54631: "slather",
        54632: "slaw",
        54633: "sled",
        54634: "sleek",
        54635: "sleep",
        54636: "sleet",
        54641: "sleeve",
        54642: "slept",
        54643: "sliceable",
        54644: "sliced",
        54645: "slicer",
        54646: "slicing",
        54651: "slick",
        54652: "slider",
        54653: "slideshow",
        54654: "sliding",
        54655: "slighted",
        54656: "slighting",
        54661: "slightly",
        54662: "slimness",
        54663: "slimy",
        54664: "slinging",
        54665: "slingshot",
        54666: "slinky",
        55111: "slip",
        55112: "slit",
        55113: "sliver",
        55114: "slobbery",
        55115: "slogan",
        55116: "sloped",
        55121: "sloping",
        55122: "sloppily",
        55123: "sloppy",
        55124: "slot",
        55125: "slouching",
        55126: "slouchy",
        55131: "sludge",
        55132: "slug",
        55133: "slum",
        55134: "slurp",
        55135: "slush",
        55136: "sly",
        55141: "small",
        55142: "smartly",
        55143: "smartness",
        55144: "smasher",
        55145: "smashing",
        55146: "smashup",
        55151: "smell",
        55152: "smelting",
        55153: "smile",
        55154: "smilingly",
        55155: "smirk",
        55156: "smite",
        55161: "smith",
        55162: "smitten",
        55163: "smock",
        55164: "smog",
        55165: "smoked",
        55166: "smokeless",
        55211: "smokiness",
        55212: "smoking",
        55213: "smoky",
        55214: "smolder",
        55215: "smooth",
        55216: "smother",
        55221: "smudge",
        55222: "smudgy",
        55223: "smuggler",
        55224: "smuggling",
        55225: "smugly",
        55226: "smugness",
        55231: "snack",
        55232: "snagged",
        55233: "snaking",
        55234: "snap",
        55235: "snare",
        55236: "snarl",
        55241: "snazzy",
        55242: "sneak",
        55243: "sneer",
        55244: "sneeze",
        55245: "sneezing",
        55246: "snide",
        55251: "sniff",
        55252: "snippet",
        55253: "snipping",
        55254: "snitch",
        55255: "snooper",
        55256: "snooze",
        55261: "snore",
        55262: "snoring",
        55263: "snorkel",
        55264: "snort",
        55265: "snout",
        55266: "snowbird",
        55311: "snowboard",
        55312: "snowbound",
        55313: "snowcap",
        55314: "snowdrift",
        55315: "snowdrop",
        55316: "snowfall",
        55321: "snowfield",
        55322: "snowflake",
        55323: "snowiness",
        55324: "snowless",
        55325: "snowman",
        55326: "snowplow",
        55331: "snowshoe",
        55332: "snowstorm",
        55333: "snowsuit",
        55334: "snowy",
        55335: "snub",
        55336: "snuff",
        55341: "snuggle",
        55342: "snugly",
        55343: "snugness",
        55344: "speak",
        55345: "spearfish",
        55346: "spearhead",
        55351: "spearman",
        55352: "spearmint",
        55353: "species",
        55354: "specimen",
        55355: "specked",
        55356: "speckled",
        55361: "specks",
        55362: "spectacle",
        55363: "spectator",
        55364: "spectrum",
        55365: "speculate",
        55366: "speech",
        55411: "speed",
        55412: "spellbind",
        55413: "speller",
        55414: "spelling",
        55415: "spendable",
        55416: "spender",
        55421: "spending",
        55422: "spent",
        55423: "spew",
        55424: "sphere",
        55425: "spherical",
        55426: "sphinx",
        55431: "spider",
        55432: "spied",
        55433: "spiffy",
        55434: "spill",
        55435: "spilt",
        55436: "spinach",
        55441: "spinal",
        55442: "spindle",
        55443: "spinner",
        55444: "spinning",
        55445: "spinout",
        55446: "spinster",
        55451: "spiny",
        55452: "spiral",
        55453: "spirited",
        55454: "spiritism",
        55455: "spirits",
        55456: "spiritual",
        55461: "splashed",
        55462: "splashing",
        55463: "splashy",
        55464: "splatter",
        55465: "spleen",
        55466: "splendid",
        55511: "splendor",
        55512: "splice",
        55513: "splicing",
        55514: "splinter",
        55515: "splotchy",
        55516: "splurge",
        55521: "spoilage",
        55522: "spoiled",
        55523: "spoiler",
        55524: "spoiling",
        55525: "spoils",
        55526: "spoken",
        55531: "spokesman",
        55532: "sponge",
        55533: "spongy",
        55534: "sponsor",
        55535: "spoof",
        55536: "spookily",
        55541: "spooky",
        55542: "spool",
        55543: "spoon",
        55544: "spore",
        55545: "sporting",
        55546: "sports",
        55551: "sporty",
        55552: "spotless",
        55553: "spotlight",
        55554: "spotted",
        55555: "spotter",
        55556: "spotting",
        55561: "spotty",
        55562: "spousal",
        55563: "spouse",
        55564: "spout",
        55565: "sprain",
        55566: "sprang",
        55611: "sprawl",
        55612: "spray",
        55613: "spree",
        55614: "sprig",
        55615: "spring",
        55616: "sprinkled",
        55621: "sprinkler",
        55622: "sprint",
        55623: "sprite",
        55624: "sprout",
        55625: "spruce",
        55626: "sprung",
        55631: "spry",
        55632: "spud",
        55633: "spur",
        55634: "sputter",
        55635: "spyglass",
        55636: "squabble",
        55641: "squad",
        55642: "squall",
        55643: "squander",
        55644: "squash",
        55645: "squatted",
        55646: "squatter",
        55651: "squatting",
        55652: "squeak",
        55653: "squealer",
        55654: "squealing",
        55655: "squeamish",
        55656: "squeegee",
        55661: "squeeze",
        55662: "squeezing",
        55663: "squid",
        55664: "squiggle",
        55665: "squiggly",
        55666: "squint",
        56111: "squire",
        56112: "squirt",
        56113: "squishier",
        56114: "squishy",
        56115: "stability",
        56116: "stabilize",
        56121: "stable",
        56122: "stack",
        56123: "stadium",
        56124: "staff",
        56125: "stage",
        56126: "staging",
        56131: "stagnant",
        56132: "stagnate",
        56133: "stainable",
        56134: "stained",
        56135: "staining",
        56136: "stainless",
        56141: "stalemate",
        56142: "staleness",
        56143: "stalling",
        56144: "stallion",
        56145: "stamina",
        56146: "stammer",
        56151: "stamp",
        56152: "stand",
        56153: "stank",
        56154: "staple",
        56155: "stapling",
        56156: "starboard",
        56161: "starch",
        56162: "stardom",
        56163: "stardust",
        56164: "starfish",
        56165: "stargazer",
        56166: "staring",
        56211: "stark",
        56212: "starless",
        56213: "starlet",
        56214: "starlight",
        56215: "starlit",
        56216: "starring",
        56221: "starry",
        56222: "starship",
        56223: "starter",
        56224: "starting",
        56225: "startle",
        56226: "startling",
        56231: "startup",
        56232: "starved",
        56233: "starving",
        56234: "stash",
        56235: "state",
        56236: "static",
        56241: "statistic",
        56242: "statue",
        56243: "stature",
        56244: "status",
        56245: "statute",
        56246: "statutory",
        56251: "staunch",
        56252: "stays",
        56253: "steadfast",
        56254: "steadier",
        56255: "steadily",
        56256: "steadying",
        56261: "steam",
        56262: "steed",
        56263: "steep",
        56264: "steerable",
        56265: "steering",
        56266: "steersman",
        56311: "stegosaur",
        56312: "stellar",
        56313: "stem",
        56314: "stench",
        56315: "stencil",
        56316: "step",
        56321: "stereo",
        56322: "sterile",
        56323: "sterility",
        56324: "sterilize",
        56325: "sterling",
        56326: "sternness",
        56331: "sternum",
        56332: "stew",
        56333: "stick",
        56334: "stiffen",
        56335: "stiffly",
        56336: "stiffness",
        56341: "stifle",
        56342: "stifling",
        56343: "stillness",
        56344: "stilt",
        56345: "stimulant",
        56346: "stimulate",
        56351: "stimuli",
        56352: "stimulus",
        56353: "stinger",
        56354: "stingily",
        56355: "stinging",
        56356: "stingray",
        56361: "stingy",
        56362: "stinking",
        56363: "stinky",
        56364: "stipend",
        56365: "stipulate",
        56366: "stir",
        56411: "stitch",
        56412: "stock",
        56413: "stoic",
        56414: "stoke",
        56415: "stole",
        56416: "stomp",
        56421: "stonewall",
        56422: "stoneware",
        56423: "stonework",
        56424: "stoning",
        56425: "stony",
        56426: "stood",
        56431: "stooge",
        56432: "stool",
        56433: "stoop",
        56434: "stoplight",
        56435: "stoppable",
        56436: "stoppage",
        56441: "stopped",
        56442: "stopper",
        56443: "stopping",
        56444: "stopwatch",
        56445: "storable",
        56446: "storage",
        56451: "storeroom",
        56452: "storewide",
        56453: "storm",
        56454: "stout",
        56455: "stove",
        56456: "stowaway",
        56461: "stowing",
        56462: "straddle",
        56463: "straggler",
        56464: "strained",
        56465: "strainer",
        56466: "straining",
        56511: "strangely",
        56512: "stranger",
        56513: "strangle",
        56514: "strategic",
        56515: "strategy",
        56516: "stratus",
        56521: "straw",
        56522: "stray",
        56523: "streak",
        56524: "stream",
        56525: "street",
        56526: "strength",
        56531: "strenuous",
        56532: "strep",
        56533: "stress",
        56534: "stretch",
        56535: "strewn",
        56536: "stricken",
        56541: "strict",
        56542: "stride",
        56543: "strife",
        56544: "strike",
        56545: "striking",
        56546: "strive",
        56551: "striving",
        56552: "strobe",
        56553: "strode",
        56554: "stroller",
        56555: "strongbox",
        56556: "strongly",
        56561: "strongman",
        56562: "struck",
        56563: "structure",
        56564: "strudel",
        56565: "struggle",
        56566: "strum",
        56611: "strung",
        56612: "strut",
        56613: "stubbed",
        56614: "stubble",
        56615: "stubbly",
        56616: "stubborn",
        56621: "stucco",
        56622: "stuck",
        56623: "student",
        56624: "studied",
        56625: "studio",
        56626: "study",
        56631: "stuffed",
        56632: "stuffing",
        56633: "stuffy",
        56634: "stumble",
        56635: "stumbling",
        56636: "stump",
        56641: "stung",
        56642: "stunned",
        56643: "stunner",
        56644: "stunning",
        56645: "stunt",
        56646: "stupor",
        56651: "sturdily",
        56652: "sturdy",
        56653: "styling",
        56654: "stylishly",
        56655: "stylist",
        56656: "stylized",
        56661: "stylus",
        56662: "suave",
        56663: "subarctic",
        56664: "subatomic",
        56665: "subdivide",
        56666: "subdued",
        61111: "subduing",
        61112: "subfloor",
        61113: "subgroup",
        61114: "subheader",
        61115: "subject",
        61116: "sublease",
        61121: "sublet",
        61122: "sublevel",
        61123: "sublime",
        61124: "submarine",
        61125: "submerge",
        61126: "submersed",
        61131: "submitter",
        61132: "subpanel",
        61133: "subpar",
        61134: "subplot",
        61135: "subprime",
        61136: "subscribe",
        61141: "subscript",
        61142: "subsector",
        61143: "subside",
        61144: "subsiding",
        61145: "subsidize",
        61146: "subsidy",
        61151: "subsoil",
        61152: "subsonic",
        61153: "substance",
        61154: "subsystem",
        61155: "subtext",
        61156: "subtitle",
        61161: "subtly",
        61162: "subtotal",
        61163: "subtract",
        61164: "subtype",
        61165: "suburb",
        61166: "subway",
        61211: "subwoofer",
        61212: "subzero",
        61213: "succulent",
        61214: "such",
        61215: "suction",
        61216: "sudden",
        61221: "sudoku",
        61222: "suds",
        61223: "sufferer",
        61224: "suffering",
        61225: "suffice",
        61226: "suffix",
        61231: "suffocate",
        61232: "suffrage",
        61233: "sugar",
        61234: "suggest",
        61235: "suing",
        61236: "suitable",
        61241: "suitably",
        61242: "suitcase",
        61243: "suitor",
        61244: "sulfate",
        61245: "sulfide",
        61246: "sulfite",
        61251: "sulfur",
        61252: "sulk",
        61253: "sullen",
        61254: "sulphate",
        61255: "sulphuric",
        61256: "sultry",
        61261: "superbowl",
        61262: "superglue",
        61263: "superhero",
        61264: "superior",
        61265: "superjet",
        61266: "superman",
        61311: "supermom",
        61312: "supernova",
        61313: "supervise",
        61314: "supper",
        61315: "supplier",
        61316: "supply",
        61321: "support",
        61322: "supremacy",
        61323: "supreme",
        61324: "surcharge",
        61325: "surely",
        61326: "sureness",
        61331: "surface",
        61332: "surfacing",
        61333: "surfboard",
        61334: "surfer",
        61335: "surgery",
        61336: "surgical",
        61341: "surging",
        61342: "surname",
        61343: "surpass",
        61344: "surplus",
        61345: "surprise",
        61346: "surreal",
        61351: "surrender",
        61352: "surrogate",
        61353: "surround",
        61354: "survey",
        61355: "survival",
        61356: "survive",
        61361: "surviving",
        61362: "survivor",
        61363: "sushi",
        61364: "suspect",
        61365: "suspend",
        61366: "suspense",
        61411: "sustained",
        61412: "sustainer",
        61413: "swab",
        61414: "swaddling",
        61415: "swagger",
        61416: "swampland",
        61421: "swan",
        61422: "swapping",
        61423: "swarm",
        61424: "sway",
        61425: "swear",
        61426: "sweat",
        61431: "sweep",
        61432: "swell",
        61433: "swept",
        61434: "swerve",
        61435: "swifter",
        61436: "swiftly",
        61441: "swiftness",
        61442: "swimmable",
        61443: "swimmer",
        61444: "swimming",
        61445: "swimsuit",
        61446: "swimwear",
        61451: "swinger",
        61452: "swinging",
        61453: "swipe",
        61454: "swirl",
        61455: "switch",
        61456: "swivel",
        61461: "swizzle",
        61462: "swooned",
        61463: "swoop",
        61464: "swoosh",
        61465: "swore",
        61466: "sworn",
        61511: "swung",
        61512: "sycamore",
        61513: "sympathy",
        61514: "symphonic",
        61515: "symphony",
        61516: "symptom",
        61521: "synapse",
        61522: "syndrome",
        61523: "synergy",
        61524: "synopses",
        61525: "synopsis",
        61526: "synthesis",
        61531: "synthetic",
        61532: "syrup",
        61533: "system",
        61534: "t-shirt",
        61535: "tabasco",
        61536: "tabby",
        61541: "tableful",
        61542: "tables",
        61543: "tablet",
        61544: "tableware",
        61545: "tabloid",
        61546: "tackiness",
        61551: "tacking",
        61552: "tackle",
        61553: "tackling",
        61554: "tacky",
        61555: "taco",
        61556: "tactful",
        61561: "tactical",
        61562: "tactics",
        61563: "tactile",
        61564: "tactless",
        61565: "tadpole",
        61566: "taekwondo",
        61611: "tag",
        61612: "tainted",
        61613: "take",
        61614: "taking",
        61615: "talcum",
        61616: "talisman",
        61621: "tall",
        61622: "talon",
        61623: "tamale",
        61624: "tameness",
        61625: "tamer",
        61626: "tamper",
        61631: "tank",
        61632: "tanned",
        61633: "tannery",
        61634: "tanning",
        61635: "tantrum",
        61636: "tapeless",
        61641: "tapered",
        61642: "tapering",
        61643: "tapestry",
        61644: "tapioca",
        61645: "tapping",
        61646: "taps",
        61651: "tarantula",
        61652: "target",
        61653: "tarmac",
        61654: "tarnish",
        61655: "tarot",
        61656: "tartar",
        61661: "tartly",
        61662: "tartness",
        61663: "task",
        61664: "tassel",
        61665: "taste",
        61666: "tastiness",
        62111: "tasting",
        62112: "tasty",
        62113: "tattered",
        62114: "tattle",
        62115: "tattling",
        62116: "tattoo",
        62121: "taunt",
        62122: "tavern",
        62123: "thank",
        62124: "that",
        62125: "thaw",
        62126: "theater",
        62131: "theatrics",
        62132: "thee",
        62133: "theft",
        62134: "theme",
        62135: "theology",
        62136: "theorize",
        62141: "thermal",
        62142: "thermos",
        62143: "thesaurus",
        62144: "these",
        62145: "thesis",
        62146: "thespian",
        62151: "thicken",
        62152: "thicket",
        62153: "thickness",
        62154: "thieving",
        62155: "thievish",
        62156: "thigh",
        62161: "thimble",
        62162: "thing",
        62163: "think",
        62164: "thinly",
        62165: "thinner",
        62166: "thinness",
        62211: "thinning",
        62212: "thirstily",
        62213: "thirsting",
        62214: "thirsty",
        62215: "thirteen",
        62216: "thirty",
        62221: "thong",
        62222: "thorn",
        62223: "those",
        62224: "thousand",
        62225: "thrash",
        62226: "thread",
        62231: "threaten",
        62232: "threefold",
        62233: "thrift",
        62234: "thrill",
        62235: "thrive",
        62236: "thriving",
        62241: "throat",
        62242: "throbbing",
        62243: "throng",
        62244: "throttle",
        62245: "throwaway",
        62246: "throwback",
        62251: "thrower",
        62252: "throwing",
        62253: "thud",
        62254: "thumb",
        62255: "thumping",
        62256: "thursday",
        62261: "thus",
        62262: "thwarting",
        62263: "thyself",
        62264: "tiara",
        62265: "tibia",
        62266: "tidal",
        62311: "tidbit",
        62312: "tidiness",
        62313: "tidings",
        62314: "tidy",
        62315: "tiger",
        62316: "tighten",
        62321: "tightly",
        62322: "tightness",
        62323: "tightrope",
        62324: "tightwad",
        62325: "tigress",
        62326: "tile",
        62331: "tiling",
        62332: "till",
        62333: "tilt",
        62334: "timid",
        62335: "timing",
        62336: "timothy",
        62341: "tinderbox",
        62342: "tinfoil",
        62343: "tingle",
        62344: "tingling",
        62345: "tingly",
        62346: "tinker",
        62351: "tinkling",
        62352: "tinsel",
        62353: "tinsmith",
        62354: "tint",
        62355: "tinwork",
        62356: "tiny",
        62361: "tipoff",
        62362: "tipped",
        62363: "tipper",
        62364: "tipping",
        62365: "tiptoeing",
        62366: "tiptop",
        62411: "tiring",
        62412: "tissue",
        62413: "trace",
        62414: "tracing",
        62415: "track",
        62416: "traction",
        62421: "tractor",
        62422: "trade",
        62423: "trading",
        62424: "tradition",
        62425: "traffic",
        62426: "tragedy",
        62431: "trailing",
        62432: "trailside",
        62433: "train",
        62434: "traitor",
        62435: "trance",
        62436: "tranquil",
        62441: "transfer",
        62442: "transform",
        62443: "translate",
        62444: "transpire",
        62445: "transport",
        62446: "transpose",
        62451: "trapdoor",
        62452: "trapeze",
        62453: "trapezoid",
        62454: "trapped",
        62455: "trapper",
        62456: "trapping",
        62461: "traps",
        62462: "trash",
        62463: "travel",
        62464: "traverse",
        62465: "travesty",
        62466: "tray",
        62511: "treachery",
        62512: "treading",
        62513: "treadmill",
        62514: "treason",
        62515: "treat",
        62516: "treble",
        62521: "tree",
        62522: "trekker",
        62523: "tremble",
        62524: "trembling",
        62525: "tremor",
        62526: "trench",
        62531: "trend",
        62532: "trespass",
        62533: "triage",
        62534: "trial",
        62535: "triangle",
        62536: "tribesman",
        62541: "tribunal",
        62542: "tribune",
        62543: "tributary",
        62544: "tribute",
        62545: "triceps",
        62546: "trickery",
        62551: "trickily",
        62552: "tricking",
        62553: "trickle",
        62554: "trickster",
        62555: "tricky",
        62556: "tricolor",
        62561: "tricycle",
        62562: "trident",
        62563: "tried",
        62564: "trifle",
        62565: "trifocals",
        62566: "trillion",
        62611: "trilogy",
        62612: "trimester",
        62613: "trimmer",
        62614: "trimming",
        62615: "trimness",
        62616: "trinity",
        62621: "trio",
        62622: "tripod",
        62623: "tripping",
        62624: "triumph",
        62625: "trivial",
        62626: "trodden",
        62631: "trolling",
        62632: "trombone",
        62633: "trophy",
        62634: "tropical",
        62635: "tropics",
        62636: "trouble",
        62641: "troubling",
        62642: "trough",
        62643: "trousers",
        62644: "trout",
        62645: "trowel",
        62646: "truce",
        62651: "truck",
        62652: "truffle",
        62653: "trump",
        62654: "trunks",
        62655: "trustable",
        62656: "trustee",
        62661: "trustful",
        62662: "trusting",
        62663: "trustless",
        62664: "truth",
        62665: "try",
        62666: "tubby",
        63111: "tubeless",
        63112: "tubular",
        63113: "tucking",
        63114: "tuesday",
        63115: "tug",
        63116: "tuition",
        63121: "tulip",
        63122: "tumble",
        63123: "tumbling",
        63124: "tummy",
        63125: "turban",
        63126: "turbine",
        63131: "turbofan",
        63132: "turbojet",
        63133: "turbulent",
        63134: "turf",
        63135: "turkey",
        63136: "turmoil",
        63141: "turret",
        63142: "turtle",
        63143: "tusk",
        63144: "tutor",
        63145: "tutu",
        63146: "tux",
        63151: "tweak",
        63152: "tweed",
        63153: "tweet",
        63154: "tweezers",
        63155: "twelve",
        63156: "twentieth",
        63161: "twenty",
        63162: "twerp",
        63163: "twice",
        63164: "twiddle",
        63165: "twiddling",
        63166: "twig",
        63211: "twilight",
        63212: "twine",
        63213: "twins",
        63214: "twirl",
        63215: "twistable",
        63216: "twisted",
        63221: "twister",
        63222: "twisting",
        63223: "twisty",
        63224: "twitch",
        63225: "twitter",
        63226: "tycoon",
        63231: "tying",
        63232: "tyke",
        63233: "udder",
        63234: "ultimate",
        63235: "ultimatum",
        63236: "ultra",
        63241: "umbilical",
        63242: "umbrella",
        63243: "umpire",
        63244: "unabashed",
        63245: "unable",
        63246: "unadorned",
        63251: "unadvised",
        63252: "unafraid",
        63253: "unaired",
        63254: "unaligned",
        63255: "unaltered",
        63256: "unarmored",
        63261: "unashamed",
        63262: "unaudited",
        63263: "unawake",
        63264: "unaware",
        63265: "unbaked",
        63266: "unbalance",
        63311: "unbeaten",
        63312: "unbend",
        63313: "unbent",
        63314: "unbiased",
        63315: "unbitten",
        63316: "unblended",
        63321: "unblessed",
        63322: "unblock",
        63323: "unbolted",
        63324: "unbounded",
        63325: "unboxed",
        63326: "unbraided",
        63331: "unbridle",
        63332: "unbroken",
        63333: "unbuckled",
        63334: "unbundle",
        63335: "unburned",
        63336: "unbutton",
        63341: "uncanny",
        63342: "uncapped",
        63343: "uncaring",
        63344: "uncertain",
        63345: "unchain",
        63346: "unchanged",
        63351: "uncharted",
        63352: "uncheck",
        63353: "uncivil",
        63354: "unclad",
        63355: "unclaimed",
        63356: "unclamped",
        63361: "unclasp",
        63362: "uncle",
        63363: "unclip",
        63364: "uncloak",
        63365: "unclog",
        63366: "unclothed",
        63411: "uncoated",
        63412: "uncoiled",
        63413: "uncolored",
        63414: "uncombed",
        63415: "uncommon",
        63416: "uncooked",
        63421: "uncork",
        63422: "uncorrupt",
        63423: "uncounted",
        63424: "uncouple",
        63425: "uncouth",
        63426: "uncover",
        63431: "uncross",
        63432: "uncrown",
        63433: "uncrushed",
        63434: "uncured",
        63435: "uncurious",
        63436: "uncurled",
        63441: "uncut",
        63442: "undamaged",
        63443: "undated",
        63444: "undaunted",
        63445: "undead",
        63446: "undecided",
        63451: "undefined",
        63452: "underage",
        63453: "underarm",
        63454: "undercoat",
        63455: "undercook",
        63456: "undercut",
        63461: "underdog",
        63462: "underdone",
        63463: "underfed",
        63464: "underfeed",
        63465: "underfoot",
        63466: "undergo",
        63511: "undergrad",
        63512: "underhand",
        63513: "underline",
        63514: "underling",
        63515: "undermine",
        63516: "undermost",
        63521: "underpaid",
        63522: "underpass",
        63523: "underpay",
        63524: "underrate",
        63525: "undertake",
        63526: "undertone",
        63531: "undertook",
        63532: "undertow",
        63533: "underuse",
        63534: "underwear",
        63535: "underwent",
        63536: "underwire",
        63541: "undesired",
        63542: "undiluted",
        63543: "undivided",
        63544: "undocked",
        63545: "undoing",
        63546: "undone",
        63551: "undrafted",
        63552: "undress",
        63553: "undrilled",
        63554: "undusted",
        63555: "undying",
        63556: "unearned",
        63561: "unearth",
        63562: "unease",
        63563: "uneasily",
        63564: "uneasy",
        63565: "uneatable",
        63566: "uneaten",
        63611: "unedited",
        63612: "unelected",
        63613: "unending",
        63614: "unengaged",
        63615: "unenvied",
        63616: "unequal",
        63621: "unethical",
        63622: "uneven",
        63623: "unexpired",
        63624: "unexposed",
        63625: "unfailing",
        63626: "unfair",
        63631: "unfasten",
        63632: "unfazed",
        63633: "unfeeling",
        63634: "unfiled",
        63635: "unfilled",
        63636: "unfitted",
        63641: "unfitting",
        63642: "unfixable",
        63643: "unfixed",
        63644: "unflawed",
        63645: "unfocused",
        63646: "unfold",
        63651: "unfounded",
        63652: "unframed",
        63653: "unfreeze",
        63654: "unfrosted",
        63655: "unfrozen",
        63656: "unfunded",
        63661: "unglazed",
        63662: "ungloved",
        63663: "unglue",
        63664: "ungodly",
        63665: "ungraded",
        63666: "ungreased",
        64111: "unguarded",
        64112: "unguided",
        64113: "unhappily",
        64114: "unhappy",
        64115: "unharmed",
        64116: "unhealthy",
        64121: "unheard",
        64122: "unhearing",
        64123: "unheated",
        64124: "unhelpful",
        64125: "unhidden",
        64126: "unhinge",
        64131: "unhitched",
        64132: "unholy",
        64133: "unhook",
        64134: "unicorn",
        64135: "unicycle",
        64136: "unified",
        64141: "unifier",
        64142: "uniformed",
        64143: "uniformly",
        64144: "unify",
        64145: "unimpeded",
        64146: "uninjured",
        64151: "uninstall",
        64152: "uninsured",
        64153: "uninvited",
        64154: "union",
        64155: "uniquely",
        64156: "unisexual",
        64161: "unison",
        64162: "unissued",
        64163: "unit",
        64164: "universal",
        64165: "universe",
        64166: "unjustly",
        64211: "unkempt",
        64212: "unkind",
        64213: "unknotted",
        64214: "unknowing",
        64215: "unknown",
        64216: "unlaced",
        64221: "unlatch",
        64222: "unlawful",
        64223: "unleaded",
        64224: "unlearned",
        64225: "unleash",
        64226: "unless",
        64231: "unleveled",
        64232: "unlighted",
        64233: "unlikable",
        64234: "unlimited",
        64235: "unlined",
        64236: "unlinked",
        64241: "unlisted",
        64242: "unlit",
        64243: "unlivable",
        64244: "unloaded",
        64245: "unloader",
        64246: "unlocked",
        64251: "unlocking",
        64252: "unlovable",
        64253: "unloved",
        64254: "unlovely",
        64255: "unloving",
        64256: "unluckily",
        64261: "unlucky",
        64262: "unmade",
        64263: "unmanaged",
        64264: "unmanned",
        64265: "unmapped",
        64266: "unmarked",
        64311: "unmasked",
        64312: "unmasking",
        64313: "unmatched",
        64314: "unmindful",
        64315: "unmixable",
        64316: "unmixed",
        64321: "unmolded",
        64322: "unmoral",
        64323: "unmovable",
        64324: "unmoved",
        64325: "unmoving",
        64326: "unnamable",
        64331: "unnamed",
        64332: "unnatural",
        64333: "unneeded",
        64334: "unnerve",
        64335: "unnerving",
        64336: "unnoticed",
        64341: "unopened",
        64342: "unopposed",
        64343: "unpack",
        64344: "unpadded",
        64345: "unpaid",
        64346: "unpainted",
        64351: "unpaired",
        64352: "unpaved",
        64353: "unpeeled",
        64354: "unpicked",
        64355: "unpiloted",
        64356: "unpinned",
        64361: "unplanned",
        64362: "unplanted",
        64363: "unpleased",
        64364: "unpledged",
        64365: "unplowed",
        64366: "unplug",
        64411: "unpopular",
        64412: "unproven",
        64413: "unquote",
        64414: "unranked",
        64415: "unrated",
        64416: "unraveled",
        64421: "unreached",
        64422: "unread",
        64423: "unreal",
        64424: "unreeling",
        64425: "unrefined",
        64426: "unrelated",
        64431: "unrented",
        64432: "unrest",
        64433: "unretired",
        64434: "unrevised",
        64435: "unrigged",
        64436: "unripe",
        64441: "unrivaled",
        64442: "unroasted",
        64443: "unrobed",
        64444: "unroll",
        64445: "unruffled",
        64446: "unruly",
        64451: "unrushed",
        64452: "unsaddle",
        64453: "unsafe",
        64454: "unsaid",
        64455: "unsalted",
        64456: "unsaved",
        64461: "unsavory",
        64462: "unscathed",
        64463: "unscented",
        64464: "unscrew",
        64465: "unsealed",
        64466: "unseated",
        64511: "unsecured",
        64512: "unseeing",
        64513: "unseemly",
        64514: "unseen",
        64515: "unselect",
        64516: "unselfish",
        64521: "unsent",
        64522: "unsettled",
        64523: "unshackle",
        64524: "unshaken",
        64525: "unshaved",
        64526: "unshaven",
        64531: "unsheathe",
        64532: "unshipped",
        64533: "unsightly",
        64534: "unsigned",
        64535: "unskilled",
        64536: "unsliced",
        64541: "unsmooth",
        64542: "unsnap",
        64543: "unsocial",
        64544: "unsoiled",
        64545: "unsold",
        64546: "unsolved",
        64551: "unsorted",
        64552: "unspoiled",
        64553: "unspoken",
        64554: "unstable",
        64555: "unstaffed",
        64556: "unstamped",
        64561: "unsteady",
        64562: "unsterile",
        64563: "unstirred",
        64564: "unstitch",
        64565: "unstopped",
        64566: "unstuck",
        64611: "unstuffed",
        64612: "unstylish",
        64613: "unsubtle",
        64614: "unsubtly",
        64615: "unsuited",
        64616: "unsure",
        64621: "unsworn",
        64622: "untagged",
        64623: "untainted",
        64624: "untaken",
        64625: "untamed",
        64626: "untangled",
        64631: "untapped",
        64632: "untaxed",
        64633: "unthawed",
        64634: "unthread",
        64635: "untidy",
        64636: "untie",
        64641: "until",
        64642: "untimed",
        64643: "untimely",
        64644: "untitled",
        64645: "untoasted",
        64646: "untold",
        64651: "untouched",
        64652: "untracked",
        64653: "untrained",
        64654: "untreated",
        64655: "untried",
        64656: "untrimmed",
        64661: "untrue",
        64662: "untruth",
        64663: "unturned",
        64664: "untwist",
        64665: "untying",
        64666: "unusable",
        65111: "unused",
        65112: "unusual",
        65113: "unvalued",
        65114: "unvaried",
        65115: "unvarying",
        65116: "unveiled",
        65121: "unveiling",
        65122: "unvented",
        65123: "unviable",
        65124: "unvisited",
        65125: "unvocal",
        65126: "unwanted",
        65131: "unwarlike",
        65132: "unwary",
        65133: "unwashed",
        65134: "unwatched",
        65135: "unweave",
        65136: "unwed",
        65141: "unwelcome",
        65142: "unwell",
        65143: "unwieldy",
        65144: "unwilling",
        65145: "unwind",
        65146: "unwired",
        65151: "unwitting",
        65152: "unwomanly",
        65153: "unworldly",
        65154: "unworn",
        65155: "unworried",
        65156: "unworthy",
        65161: "unwound",
        65162: "unwoven",
        65163: "unwrapped",
        65164: "unwritten",
        65165: "unzip",
        65166: "upbeat",
        65211: "upchuck",
        65212: "upcoming",
        65213: "upcountry",
        65214: "update",
        65215: "upfront",
        65216: "upgrade",
        65221: "upheaval",
        65222: "upheld",
        65223: "uphill",
        65224: "uphold",
        65225: "uplifted",
        65226: "uplifting",
        65231: "upload",
        65232: "upon",
        65233: "upper",
        65234: "upright",
        65235: "uprising",
        65236: "upriver",
        65241: "uproar",
        65242: "uproot",
        65243: "upscale",
        65244: "upside",
        65245: "upstage",
        65246: "upstairs",
        65251: "upstart",
        65252: "upstate",
        65253: "upstream",
        65254: "upstroke",
        65255: "upswing",
        65256: "uptake",
        65261: "uptight",
        65262: "uptown",
        65263: "upturned",
        65264: "upward",
        65265: "upwind",
        65266: "uranium",
        65311: "urban",
        65312: "urchin",
        65313: "urethane",
        65314: "urgency",
        65315: "urgent",
        65316: "urging",
        65321: "urologist",
        65322: "urology",
        65323: "usable",
        65324: "usage",
        65325: "useable",
        65326: "used",
        65331: "uselessly",
        65332: "user",
        65333: "usher",
        65334: "usual",
        65335: "utensil",
        65336: "utility",
        65341: "utilize",
        65342: "utmost",
        65343: "utopia",
        65344: "utter",
        65345: "vacancy",
        65346: "vacant",
        65351: "vacate",
        65352: "vacation",
        65353: "vagabond",
        65354: "vagrancy",
        65355: "vagrantly",
        65356: "vaguely",
        65361: "vagueness",
        65362: "valiant",
        65363: "valid",
        65364: "valium",
        65365: "valley",
        65366: "valuables",
        65411: "value",
        65412: "vanilla",
        65413: "vanish",
        65414: "vanity",
        65415: "vanquish",
        65416: "vantage",
        65421: "vaporizer",
        65422: "variable",
        65423: "variably",
        65424: "varied",
        65425: "variety",
        65426: "various",
        65431: "varmint",
        65432: "varnish",
        65433: "varsity",
        65434: "varying",
        65435: "vascular",
        65436: "vaseline",
        65441: "vastly",
        65442: "vastness",
        65443: "veal",
        65444: "vegan",
        65445: "veggie",
        65446: "vehicular",
        65451: "velcro",
        65452: "velocity",
        65453: "velvet",
        65454: "vendetta",
        65455: "vending",
        65456: "vendor",
        65461: "veneering",
        65462: "vengeful",
        65463: "venomous",
        65464: "ventricle",
        65465: "venture",
        65466: "venue",
        65511: "venus",
        65512: "verbalize",
        65513: "verbally",
        65514: "verbose",
        65515: "verdict",
        65516: "verify",
        65521: "verse",
        65522: "version",
        65523: "versus",
        65524: "vertebrae",
        65525: "vertical",
        65526: "vertigo",
        65531: "very",
        65532: "vessel",
        65533: "vest",
        65534: "veteran",
        65535: "veto",
        65536: "vexingly",
        65541: "viability",
        65542: "viable",
        65543: "vibes",
        65544: "vice",
        65545: "vicinity",
        65546: "victory",
        65551: "video",
        65552: "viewable",
        65553: "viewer",
        65554: "viewing",
        65555: "viewless",
        65556: "viewpoint",
        65561: "vigorous",
        65562: "village",
        65563: "villain",
        65564: "vindicate",
        65565: "vineyard",
        65566: "vintage",
        65611: "violate",
        65612: "violation",
        65613: "violator",
        65614: "violet",
        65615: "violin",
        65616: "viper",
        65621: "viral",
        65622: "virtual",
        65623: "virtuous",
        65624: "virus",
        65625: "visa",
        65626: "viscosity",
        65631: "viscous",
        65632: "viselike",
        65633: "visible",
        65634: "visibly",
        65635: "vision",
        65636: "visiting",
        65641: "visitor",
        65642: "visor",
        65643: "vista",
        65644: "vitality",
        65645: "vitalize",
        65646: "vitally",
        65651: "vitamins",
        65652: "vivacious",
        65653: "vividly",
        65654: "vividness",
        65655: "vixen",
        65656: "vocalist",
        65661: "vocalize",
        65662: "vocally",
        65663: "vocation",
        65664: "voice",
        65665: "voicing",
        65666: "void",
        66111: "volatile",
        66112: "volley",
        66113: "voltage",
        66114: "volumes",
        66115: "voter",
        66116: "voting",
        66121: "voucher",
        66122: "vowed",
        66123: "vowel",
        66124: "voyage",
        66125: "wackiness",
        66126: "wad",
        66131: "wafer",
        66132: "waffle",
        66133: "waged",
        66134: "wager",
        66135: "wages",
        66136: "waggle",
        66141: "wagon",
        66142: "wake",
        66143: "waking",
        66144: "walk",
        66145: "walmart",
        66146: "walnut",
        66151: "walrus",
        66152: "waltz",
        66153: "wand",
        66154: "wannabe",
        66155: "wanted",
        66156: "wanting",
        66161: "wasabi",
        66162: "washable",
        66163: "washbasin",
        66164: "washboard",
        66165: "washbowl",
        66166: "washcloth",
        66211: "washday",
        66212: "washed",
        66213: "washer",
        66214: "washhouse",
        66215: "washing",
        66216: "washout",
        66221: "washroom",
        66222: "washstand",
        66223: "washtub",
        66224: "wasp",
        66225: "wasting",
        66226: "watch",
        66231: "water",
        66232: "waviness",
        66233: "waving",
        66234: "wavy",
        66235: "whacking",
        66236: "whacky",
        66241: "wham",
        66242: "wharf",
        66243: "wheat",
        66244: "whenever",
        66245: "whiff",
        66246: "whimsical",
        66251: "whinny",
        66252: "whiny",
        66253: "whisking",
        66254: "whoever",
        66255: "whole",
        66256: "whomever",
        66261: "whoopee",
        66262: "whooping",
        66263: "whoops",
        66264: "why",
        66265: "wick",
        66266: "widely",
        66311: "widen",
        66312: "widget",
        66313: "widow",
        66314: "width",
        66315: "wieldable",
        66316: "wielder",
        66321: "wife",
        66322: "wifi",
        66323: "wikipedia",
        66324: "wildcard",
        66325: "wildcat",
        66326: "wilder",
        66331: "wildfire",
        66332: "wildfowl",
        66333: "wildland",
        66334: "wildlife",
        66335: "wildly",
        66336: "wildness",
        66341: "willed",
        66342: "willfully",
        66343: "willing",
        66344: "willow",
        66345: "willpower",
        66346: "wilt",
        66351: "wimp",
        66352: "wince",
        66353: "wincing",
        66354: "wind",
        66355: "wing",
        66356: "winking",
        66361: "winner",
        66362: "winnings",
        66363: "winter",
        66364: "wipe",
        66365: "wired",
        66366: "wireless",
        66411: "wiring",
        66412: "wiry",
        66413: "wisdom",
        66414: "wise",
        66415: "wish",
        66416: "wisplike",
        66421: "wispy",
        66422: "wistful",
        66423: "wizard",
        66424: "wobble",
        66425: "wobbling",
        66426: "wobbly",
        66431: "wok",
        66432: "wolf",
        66433: "wolverine",
        66434: "womanhood",
        66435: "womankind",
        66436: "womanless",
        66441: "womanlike",
        66442: "womanly",
        66443: "womb",
        66444: "woof",
        66445: "wooing",
        66446: "wool",
        66451: "woozy",
        66452: "word",
        66453: "work",
        66454: "worried",
        66455: "worrier",
        66456: "worrisome",
        66461: "worry",
        66462: "worsening",
        66463: "worshiper",
        66464: "worst",
        66465: "wound",
        66466: "woven",
        66511: "wow",
        66512: "wrangle",
        66513: "wrath",
        66514: "wreath",
        66515: "wreckage",
        66516: "wrecker",
        66521: "wrecking",
        66522: "wrench",
        66523: "wriggle",
        66524: "wriggly",
        66525: "wrinkle",
        66526: "wrinkly",
        66531: "wrist",
        66532: "writing",
        66533: "written",
        66534: "wrongdoer",
        66535: "wronged",
        66536: "wrongful",
        66541: "wrongly",
        66542: "wrongness",
        66543: "wrought",
        66544: "xbox",
        66545: "xerox",
        66546: "yahoo",
        66551: "yam",
        66552: "yanking",
        66553: "yapping",
        66554: "yard",
        66555: "yarn",
        66556: "yeah",
        66561: "yearbook",
        66562: "yearling",
        66563: "yearly",
        66564: "yearning",
        66565: "yeast",
        66566: "yelling",
        66611: "yelp",
        66612: "yen",
        66613: "yesterday",
        66614: "yiddish",
        66615: "yield",
        66616: "yin",
        66621: "yippee",
        66622: "yo-yo",
        66623: "yodel",
        66624: "yoga",
        66625: "yogurt",
        66626: "yonder",
        66631: "yoyo",
        66632: "yummy",
        66633: "zap",
        66634: "zealous",
        66635: "zebra",
        66636: "zen",
        66641: "zeppelin",
        66642: "zero",
        66643: "zestfully",
        66644: "zesty",
        66645: "zigzagged",
        66646: "zipfile",
        66651: "zipping",
        66652: "zippy",
        66653: "zips",
        66654: "zit",
        66655: "zodiac",
        66656: "zombie",
        66661: "zone",
        66662: "zoning",
        66663: "zookeeper",
        66664: "zoologist",
        66665: "zoology",
        66666: "zoom"
    };

    const secureRandom = async (count) => {
        // generate a cryptographically secure integer
        let cryptoObj = window.crypto;
        let rand = new Uint32Array(1);
        let skip = 0x7fffffff - 0x7fffffff % count;
        let result;
        if (((count - 1) & count) === 0) {
            cryptoObj.getRandomValues(rand);
            return rand[0] & (count - 1);
        }
        do {
            cryptoObj.getRandomValues(rand);
            result = rand[0] & 0x7fffffff;
        } while (result >= skip);
        return result % count;
    };

    const getDicewareWords = async (length, addMoreEntropy = true) => {
        // get the random words from the dice ware dict
        let wordslist = [];
        for (let i = 0; i < length; i++) {
            let newnum = [];
            for (let j = 0; j < 5; j += 1) {
                // roll a 6 sided die
                newnum.push((await secureRandom(6)) + 1);
            }
            let theword = eff[newnum.join("")];
            wordslist.push(theword.charAt(0).toUpperCase() + theword.slice(1));
        }
        let separator = addMoreEntropy ? "_" : "";
        wordslist.splice(await secureRandom(length + 1), 0, separator);
        return wordslist.join("");
    };
    const scorePassword = async (pass) => {
        let score = "0";
        if (!pass)
            return 0;
        // award every unique letter until 5 repetitions
        let letters = Object();
        for (let i = 0; i < pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }
        // bonus points for mixing it up
        let letiations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        };
        let letiationCount = 0;
        for (let check in letiations) {
            letiationCount += letiations[check] === true ? 1 : 0;
        }
        score += (letiationCount - 1) * 10;
        return Number(score);
    };

    const switchTheme = () => {
        const currentTheme = window.localStorage.getItem("theme") || "dark";
        window.localStorage.setItem("theme", currentTheme === "dark" ? "light" : "dark");
        document.documentElement.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
    };

    /* src\components\KeyAlert.svelte generated by Svelte v3.58.0 */

    const file$b = "src\\components\\KeyAlert.svelte";

    function create_fragment$c(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let b;
    	let t5;
    	let div0;
    	let button0;
    	let t7;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Weak Key";
    			t1 = space();
    			p = element("p");
    			p.textContent = "The room key you entered is insecure and could leave your chats\r\n            vulnerable. It is recommended to use the dice button.";
    			t3 = space();
    			b = element("b");
    			b.textContent = "Continue anyways?";
    			t5 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Abort";
    			t7 = space();
    			button1 = element("button");
    			button1.textContent = "Override";
    			add_location(h1, file$b, 8, 8, 194);
    			add_location(p, file$b, 9, 8, 221);
    			add_location(b, file$b, 13, 8, 392);
    			add_location(button0, file$b, 18, 12, 543);
    			attr_dev(button1, "class", "danger");
    			add_location(button1, file$b, 19, 12, 598);
    			set_style(div0, "display", "flex");
    			set_style(div0, "justify-content", "space-between");
    			set_style(div0, "margin-top", "1rem");
    			add_location(div0, file$b, 15, 8, 428);
    			attr_dev(div1, "class", "dialog__content");
    			add_location(div1, file$b, 7, 4, 155);
    			attr_dev(div2, "class", "dialog__modal");
    			add_location(div2, file$b, 5, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(div1, t3);
    			append_dev(div1, b);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t7);
    			append_dev(div0, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*dismiss*/ ctx[1])) /*dismiss*/ ctx[1].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*override*/ ctx[0])) /*override*/ ctx[0].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KeyAlert', slots, []);
    	let { override } = $$props;
    	let { dismiss } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (override === undefined && !('override' in $$props || $$self.$$.bound[$$self.$$.props['override']])) {
    			console.warn("<KeyAlert> was created without expected prop 'override'");
    		}

    		if (dismiss === undefined && !('dismiss' in $$props || $$self.$$.bound[$$self.$$.props['dismiss']])) {
    			console.warn("<KeyAlert> was created without expected prop 'dismiss'");
    		}
    	});

    	const writable_props = ['override', 'dismiss'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<KeyAlert> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('override' in $$props) $$invalidate(0, override = $$props.override);
    		if ('dismiss' in $$props) $$invalidate(1, dismiss = $$props.dismiss);
    	};

    	$$self.$capture_state = () => ({ override, dismiss });

    	$$self.$inject_state = $$props => {
    		if ('override' in $$props) $$invalidate(0, override = $$props.override);
    		if ('dismiss' in $$props) $$invalidate(1, dismiss = $$props.dismiss);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [override, dismiss];
    }

    class KeyAlert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { override: 0, dismiss: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KeyAlert",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get override() {
    		throw new Error("<KeyAlert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set override(value) {
    		throw new Error("<KeyAlert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dismiss() {
    		throw new Error("<KeyAlert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dismiss(value) {
    		throw new Error("<KeyAlert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\UnsupportedAlert.svelte generated by Svelte v3.58.0 */

    const file$a = "src\\components\\UnsupportedAlert.svelte";

    function create_fragment$b(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let b;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Unsupported Browser";
    			t1 = space();
    			p = element("p");
    			p.textContent = "The browser you are using does not support the required cryptography\r\n            APIs. Please use a more up to date browser.";
    			t3 = space();
    			b = element("b");
    			b.textContent = "This dialog cannot be closed.";
    			add_location(h1, file$a, 4, 8, 120);
    			add_location(p, file$a, 5, 8, 158);
    			add_location(b, file$a, 9, 8, 324);
    			attr_dev(div0, "class", "dialog__content");
    			add_location(div0, file$a, 3, 4, 81);
    			attr_dev(div1, "class", "dialog__modal");
    			add_location(div1, file$a, 1, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div0, t3);
    			append_dev(div0, b);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
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

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UnsupportedAlert', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UnsupportedAlert> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class UnsupportedAlert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UnsupportedAlert",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\History.svelte generated by Svelte v3.58.0 */
    const file$9 = "src\\components\\History.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (23:12) {#each history as entry}
    function create_each_block$2(ctx) {
    	let div;
    	let p0;
    	let t0_value = new Date(/*entry*/ ctx[4].timestamp).toLocaleString() + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = /*entry*/ ctx[4].username + "";
    	let t2;
    	let t3;
    	let p2;
    	let t4_value = /*entry*/ ctx[4].key + "";
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			p2 = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(p0, "class", "historyDetail svelte-106vcru");
    			set_style(p0, "color", "grey");
    			add_location(p0, file$9, 24, 20, 698);
    			attr_dev(p1, "class", "historyDetail svelte-106vcru");
    			add_location(p1, file$9, 27, 20, 862);
    			attr_dev(p2, "class", "historyDetail svelte-106vcru");
    			add_location(p2, file$9, 28, 20, 929);
    			attr_dev(div, "class", "historyBlock svelte-106vcru");
    			add_location(div, file$9, 23, 16, 650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(p1, t2);
    			append_dev(div, t3);
    			append_dev(div, p2);
    			append_dev(p2, t4);
    			append_dev(div, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*history*/ 2 && t0_value !== (t0_value = new Date(/*entry*/ ctx[4].timestamp).toLocaleString() + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*history*/ 2 && t2_value !== (t2_value = /*entry*/ ctx[4].username + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*history*/ 2 && t4_value !== (t4_value = /*entry*/ ctx[4].key + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(23:12) {#each history as entry}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div3;
    	let div2;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div0;
    	let t4;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*history*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "History";
    			t1 = space();
    			p = element("p");
    			p.textContent = "History entries are kept locally.";
    			t3 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Ok";
    			add_location(h1, file$9, 19, 8, 445);
    			add_location(p, file$9, 20, 8, 471);
    			attr_dev(div0, "class", "display: flex; flex-direction: column; align-items: center;");
    			add_location(div0, file$9, 21, 8, 521);
    			add_location(button, file$9, 33, 12, 1125);
    			set_style(div1, "display", "flex");
    			set_style(div1, "justify-content", "center");
    			set_style(div1, "margin-top", "1rem");
    			add_location(div1, file$9, 32, 8, 1040);
    			attr_dev(div2, "class", "dialog__content");
    			add_location(div2, file$9, 18, 4, 406);
    			attr_dev(div3, "class", "dialog__modal");
    			add_location(div3, file$9, 16, 0, 345);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, p);
    			append_dev(div2, t3);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*dismiss*/ ctx[0])) /*dismiss*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*history, Date*/ 2) {
    				each_value = /*history*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
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
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('History', slots, []);
    	let { dismiss } = $$props;
    	let { db } = $$props;

    	// get db entries
    	const getHistory = async () => {
    		return (await db["history"].toArray()).reverse();
    	};

    	let history = [];

    	onMount(() => {
    		getHistory().then(data => {
    			$$invalidate(1, history = data);
    		});
    	});

    	$$self.$$.on_mount.push(function () {
    		if (dismiss === undefined && !('dismiss' in $$props || $$self.$$.bound[$$self.$$.props['dismiss']])) {
    			console.warn("<History> was created without expected prop 'dismiss'");
    		}

    		if (db === undefined && !('db' in $$props || $$self.$$.bound[$$self.$$.props['db']])) {
    			console.warn("<History> was created without expected prop 'db'");
    		}
    	});

    	const writable_props = ['dismiss', 'db'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<History> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('dismiss' in $$props) $$invalidate(0, dismiss = $$props.dismiss);
    		if ('db' in $$props) $$invalidate(2, db = $$props.db);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		dismiss,
    		db,
    		getHistory,
    		history
    	});

    	$$self.$inject_state = $$props => {
    		if ('dismiss' in $$props) $$invalidate(0, dismiss = $$props.dismiss);
    		if ('db' in $$props) $$invalidate(2, db = $$props.db);
    		if ('history' in $$props) $$invalidate(1, history = $$props.history);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dismiss, history, db];
    }

    class History extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { dismiss: 0, db: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "History",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get dismiss() {
    		throw new Error("<History>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dismiss(value) {
    		throw new Error("<History>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get db() {
    		throw new Error("<History>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set db(value) {
    		throw new Error("<History>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Landing.svelte generated by Svelte v3.58.0 */
    const file$8 = "src\\routes\\Landing.svelte";

    // (41:0) {#if !window.crypto || !window.crypto.subtle}
    function create_if_block_2$2(ctx) {
    	let unsupportedalert;
    	let current;
    	unsupportedalert = new UnsupportedAlert({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(unsupportedalert.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(unsupportedalert, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(unsupportedalert.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(unsupportedalert.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(unsupportedalert, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(41:0) {#if !window.crypto || !window.crypto.subtle}",
    		ctx
    	});

    	return block;
    }

    // (45:0) {#if showAlert}
    function create_if_block_1$2(ctx) {
    	let keyalert;
    	let current;

    	keyalert = new KeyAlert({
    			props: {
    				dismiss: /*func*/ ctx[6],
    				override: /*func_1*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(keyalert.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(keyalert, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const keyalert_changes = {};
    			if (dirty & /*showAlert*/ 8) keyalert_changes.dismiss = /*func*/ ctx[6];
    			keyalert.$set(keyalert_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keyalert.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keyalert.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keyalert, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(45:0) {#if showAlert}",
    		ctx
    	});

    	return block;
    }

    // (52:0) {#if showHistory}
    function create_if_block$2(ctx) {
    	let history;
    	let current;

    	history = new History({
    			props: {
    				db: /*db*/ ctx[0],
    				dismiss: /*func_2*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(history.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(history, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const history_changes = {};
    			if (dirty & /*db*/ 1) history_changes.db = /*db*/ ctx[0];
    			if (dirty & /*showHistory*/ 16) history_changes.dismiss = /*func_2*/ ctx[8];
    			history.$set(history_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(history.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(history.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(history, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(52:0) {#if showHistory}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let div6;
    	let div0;
    	let img;
    	let img_src_value;
    	let t3;
    	let h1;
    	let t5;
    	let h2;
    	let t7;
    	let div2;
    	let input0;
    	let t8;
    	let div1;
    	let giperspectivedicesixfacestwo0;
    	let t9;
    	let div4;
    	let input1;
    	let t10;
    	let div3;
    	let giperspectivedicesixfacestwo1;
    	let t11;
    	let div5;
    	let button0;
    	let t13;
    	let button1;
    	let t15;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = (!window.crypto || !window.crypto.subtle) && create_if_block_2$2(ctx);
    	let if_block1 = /*showAlert*/ ctx[3] && create_if_block_1$2(ctx);
    	let if_block2 = /*showHistory*/ ctx[4] && create_if_block$2(ctx);
    	giperspectivedicesixfacestwo0 = new GiPerspectiveDiceSixFacesTwo({ $$inline: true });
    	giperspectivedicesixfacestwo1 = new GiPerspectiveDiceSixFacesTwo({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			div6 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t3 = space();
    			h1 = element("h1");
    			h1.textContent = "CryptoChat 3.0";
    			t5 = space();
    			h2 = element("h2");
    			h2.textContent = "Simple, secure and ephemeral anonymous messaging.";
    			t7 = space();
    			div2 = element("div");
    			input0 = element("input");
    			t8 = space();
    			div1 = element("div");
    			create_component(giperspectivedicesixfacestwo0.$$.fragment);
    			t9 = space();
    			div4 = element("div");
    			input1 = element("input");
    			t10 = space();
    			div3 = element("div");
    			create_component(giperspectivedicesixfacestwo1.$$.fragment);
    			t11 = space();
    			div5 = element("div");
    			button0 = element("button");
    			button0.textContent = "Theme";
    			t13 = space();
    			button1 = element("button");
    			button1.textContent = "History";
    			t15 = space();
    			button2 = element("button");
    			button2.textContent = "Join";
    			if (!src_url_equal(img.src, img_src_value = "/logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "CryptoChat Logo");
    			attr_dev(img, "class", "svelte-1upn617");
    			add_location(img, file$8, 62, 8, 1798);
    			attr_dev(div0, "class", "imageParent svelte-1upn617");
    			add_location(div0, file$8, 61, 4, 1763);
    			add_location(h1, file$8, 64, 4, 1861);
    			add_location(h2, file$8, 65, 4, 1890);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Username");
    			add_location(input0, file$8, 67, 8, 1987);
    			attr_dev(div1, "class", "icon");
    			add_location(div1, file$8, 68, 8, 2063);
    			attr_dev(div2, "class", "textGroup svelte-1upn617");
    			add_location(div2, file$8, 66, 4, 1954);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Room Key");
    			add_location(input1, file$8, 78, 8, 2332);
    			attr_dev(div3, "class", "icon");
    			add_location(div3, file$8, 79, 8, 2407);
    			attr_dev(div4, "class", "textGroup svelte-1upn617");
    			add_location(div4, file$8, 77, 4, 2299);
    			add_location(button0, file$8, 89, 8, 2672);
    			add_location(button1, file$8, 90, 8, 2727);
    			add_location(button2, file$8, 95, 8, 2855);
    			attr_dev(div5, "class", "buttons svelte-1upn617");
    			add_location(div5, file$8, 88, 4, 2641);
    			attr_dev(div6, "class", "container svelte-1upn617");
    			add_location(div6, file$8, 60, 0, 1734);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div0, img);
    			append_dev(div6, t3);
    			append_dev(div6, h1);
    			append_dev(div6, t5);
    			append_dev(div6, h2);
    			append_dev(div6, t7);
    			append_dev(div6, div2);
    			append_dev(div2, input0);
    			set_input_value(input0, /*username*/ ctx[1]);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			mount_component(giperspectivedicesixfacestwo0, div1, null);
    			append_dev(div6, t9);
    			append_dev(div6, div4);
    			append_dev(div4, input1);
    			set_input_value(input1, /*roomKey*/ ctx[2]);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			mount_component(giperspectivedicesixfacestwo1, div3, null);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, button0);
    			append_dev(div5, t13);
    			append_dev(div5, button1);
    			append_dev(div5, t15);
    			append_dev(div5, button2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(div1, "click", /*click_handler*/ ctx[10], false, false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(div3, "click", /*click_handler_1*/ ctx[12], false, false, false, false),
    					listen_dev(button0, "click", switchTheme, false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[13], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_3*/ ctx[14], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showAlert*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*showAlert*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*showHistory*/ ctx[4]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*showHistory*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*username*/ 2 && input0.value !== /*username*/ ctx[1]) {
    				set_input_value(input0, /*username*/ ctx[1]);
    			}

    			if (dirty & /*roomKey*/ 4 && input1.value !== /*roomKey*/ ctx[2]) {
    				set_input_value(input1, /*roomKey*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(giperspectivedicesixfacestwo0.$$.fragment, local);
    			transition_in(giperspectivedicesixfacestwo1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(giperspectivedicesixfacestwo0.$$.fragment, local);
    			transition_out(giperspectivedicesixfacestwo1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div6);
    			destroy_component(giperspectivedicesixfacestwo0);
    			destroy_component(giperspectivedicesixfacestwo1);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Landing', slots, []);
    	let username = "";
    	let roomKey = "";
    	let showAlert = false;
    	let { db } = $$props;

    	const doJoin = async (bypass = false) => {
    		if (!username || !roomKey) {
    			return;
    		}

    		const passwordScore = await scorePassword(roomKey);

    		if (passwordScore < 85 && !bypass) {
    			// insecure
    			$$invalidate(3, showAlert = true);

    			return;
    		}

    		window.localStorage.setItem("username", username);
    		window.localStorage.setItem("roomKey", roomKey);

    		// add to history
    		db["history"].add({
    			username,
    			key: roomKey,
    			timestamp: Date.now()
    		});

    		// check if there are more than 3 entries
    		const history = await db["history"].toArray();

    		if (history.length > 3) {
    			// remove oldest entry
    			db["history"].delete(history[0].id);
    		}

    		window.location.href = "/chat";
    	};

    	document.documentElement.setAttribute("data-theme", window.localStorage.getItem("theme"));
    	let showHistory = false;

    	$$self.$$.on_mount.push(function () {
    		if (db === undefined && !('db' in $$props || $$self.$$.bound[$$self.$$.props['db']])) {
    			console.warn("<Landing> was created without expected prop 'db'");
    		}
    	});

    	const writable_props = ['db'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Landing> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(3, showAlert = false);
    	const func_1 = () => doJoin(true);

    	const func_2 = () => {
    		$$invalidate(4, showHistory = false);
    	};

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(1, username);
    	}

    	const click_handler = async () => {
    		$$invalidate(1, username = await getDicewareWords(2, false));
    	};

    	function input1_input_handler() {
    		roomKey = this.value;
    		$$invalidate(2, roomKey);
    	}

    	const click_handler_1 = async () => {
    		$$invalidate(2, roomKey = await getDicewareWords(7, true));
    	};

    	const click_handler_2 = () => {
    		$$invalidate(4, showHistory = true);
    	};

    	const click_handler_3 = () => doJoin(false);

    	$$self.$$set = $$props => {
    		if ('db' in $$props) $$invalidate(0, db = $$props.db);
    	};

    	$$self.$capture_state = () => ({
    		GiPerspectiveDiceSixFacesTwo,
    		getDicewareWords,
    		scorePassword,
    		switchTheme,
    		KeyAlert,
    		UnsupportedAlert,
    		History,
    		username,
    		roomKey,
    		showAlert,
    		db,
    		doJoin,
    		showHistory
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(1, username = $$props.username);
    		if ('roomKey' in $$props) $$invalidate(2, roomKey = $$props.roomKey);
    		if ('showAlert' in $$props) $$invalidate(3, showAlert = $$props.showAlert);
    		if ('db' in $$props) $$invalidate(0, db = $$props.db);
    		if ('showHistory' in $$props) $$invalidate(4, showHistory = $$props.showHistory);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		db,
    		username,
    		roomKey,
    		showAlert,
    		showHistory,
    		doJoin,
    		func,
    		func_1,
    		func_2,
    		input0_input_handler,
    		click_handler,
    		input1_input_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Landing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { db: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Landing",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get db() {
    		throw new Error("<Landing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set db(value) {
    		throw new Error("<Landing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {Word32Array} w An array of 32-bit words.
         * @return {string} The hex string.
         * @example
         *   var hexString = Hex.stringify(new Word32Array([0x293892], 6));
         */
        stringify(w) {
            const nSig = w.nSigBytes;
            const words = w.words;
            const hexChars = [];
            for (let i = 0; i < nSig; i++) {
                const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((byte >>> 4).toString(16));
                hexChars.push((byte & 0x0f).toString(16));
            }
            return hexChars.join("");
        },
        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         * @return {Word32Array} The word array.
         * @example
         *   var wordArray = Hex.parse(hexString);
         */
        parse(hexStr) {
            const Len = hexStr.length;
            if (Len % 2 !== 0) {
                throw new Error("Hex string count must be even");
            }
            else if (!/^[a-fA-F0-9]+$/.test(hexStr)) {
                throw new Error(`Invalid Hex string: ${hexStr}`);
            }
            const words = [];
            for (let i = 0; i < Len; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }
            return new Word32Array(words, Len / 2);
        }
    };

    const ua = typeof navigator !== "undefined" && navigator.userAgent ? navigator.userAgent.toLowerCase() : "";
    const IEVer = (() => {
        let ver = parseInt((/msie (\d+)/.exec(ua) || [])[1], 10);
        if (isNaN(ver)) {
            ver = parseInt((/trident\/.*; rv:(\d+)/.exec(ua) || [])[1], 10);
            if (isNaN(ver)) {
                return false;
            }
            return ver;
        }
        return ver;
    })();
    function isIE(op, ver) {
        if (IEVer === false)
            return false;
        if (!ver)
            return true;
        if (op === "<")
            return IEVer < ver;
        if (op === "<=")
            return IEVer <= ver;
        if (op === ">")
            return IEVer > ver;
        if (op === ">=")
            return IEVer >= ver;
        if (op === "=")
            return IEVer === ver;
        return IEVer === ver;
    }

    function makeRandFunction() {
        if (typeof window !== "undefined") {
            const c = window.crypto || window.msCrypto;
            if (!c) {
                if (isIE("<", 11)) {
                    console.warn("IE <= 10 uses insecure random generator. Please consider to use IE11 or another modern browser");
                    return function rand() {
                        return Math.floor(Math.random() * 512) % 256;
                    };
                }
                throw new Error("Crypto module not found");
            }
            return function rand() {
                return c.getRandomValues(new Uint32Array(1))[0];
            };
        }
        else if (typeof global !== "undefined" && global.crypto) {
            return function rand() {
                return global.crypto.randomBytes(4).readInt32LE();
            };
        }
        else if (typeof require === "function") {
            return function rand() {
                // Prevent webpack to automatically require("crypto").
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return __non_webpack_require__("crypto").randomBytes(4).readInt32LE();
            };
        }
        throw new Error("Unable to find crypto module");
    }
    const random$1 = makeRandFunction();

    /**
     * An array of 32bit words
     */
    class Word32Array {
        /**
         * Initializes a newly created word array.
         *
         * ByteArray Support thanks to
         * https://github.com/entronad/crypto-es/blob/master/lib/core.js
         * MIT License Copyright(c) LIN Chen
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} nSignificantBytes (Optional) The number of significant bytes in the words.
         * @example
         *   var words = new Word32Array();
         *   var words = new Word32Array([0x00010203, 0x04050607]);
         *   var words = new Word32Array([0x00010203, 0x04050607], 6);
         *   // Cloning wordArray can be done like below.
         *   var clone = (new Word32Array([0x00010203, 0x04050607])).clone();
         *   // or
         *   var clone = new Word32Array(new Word32Array([0x00010203, 0x04050607]));
         */
        constructor(words, nSignificantBytes) {
            if (Array.isArray(words) || !words) {
                this._words = Array.isArray(words) ? words : [];
                this._nSignificantBytes = typeof nSignificantBytes === "number" ? nSignificantBytes : this._words.length * 4;
                return;
            }
            else if (words instanceof Word32Array) {
                this._words = words.words.slice();
                this._nSignificantBytes = words.nSigBytes;
                return;
            }
            let uint8Array;
            // IE9 does not implement TypedArray. So catch exception for that case.
            try {
                if (words instanceof ArrayBuffer) {
                    uint8Array = new Uint8Array(words);
                }
                else if (words instanceof Uint8Array
                    || words instanceof Int8Array
                    || words instanceof Uint8ClampedArray
                    || words instanceof Int16Array
                    || words instanceof Uint16Array
                    || words instanceof Int32Array
                    || words instanceof Uint32Array
                    || words instanceof Float32Array
                    || words instanceof Float64Array) {
                    uint8Array = new Uint8Array(words.buffer, words.byteOffset, words.byteLength);
                }
            }
            catch (e) {
                throw new Error("Invalid argument");
            }
            if (!uint8Array) {
                throw new Error("Invalid argument");
            }
            const byteLen = uint8Array.byteLength;
            const w = [];
            for (let i = 0; i < byteLen; i++) {
                w[i >>> 2] |= uint8Array[i] << (24 - (i % 4) * 8);
            }
            this._words = w;
            this._nSignificantBytes = byteLen;
        }
        get nSigBytes() {
            return this._nSignificantBytes;
        }
        /**
         * Set significant bytes
         * @param {number} n - significant bytes
         */
        set nSigBytes(n) {
            this._nSignificantBytes = n;
        }
        /**
         * Get raw reference of internal words.
         * Modification of this raw array will affect internal words.
         */
        get words() {
            return this._words;
        }
        /**
         * Converts this word array to a string.
         *
         * @param {IEncoder?} encoder The encoding strategy to use. Default: CryptoJS.enc.Hex
         * @return {string} The stringified word array.
         * @example
         *   var string = wordArray + '';
         *   var string = wordArray.toString();
         *   var string = wordArray.toString(Utf8);
         */
        toString(encoder) {
            if (!encoder) {
                return Hex.stringify(this);
            }
            return encoder.stringify(this);
        }
        /**
         * Converts this 32bit word array to Uint8Array
         *
         * @return {Uint8Array} Unsigned int 8bit array
         * @example
         *   var word = new Word32Array([0x00102030]);
         *   var uint8 = word.toUint8Array(); // Uint8Array(4) [ 0, 16, 32, 48 ]
         */
        toUint8Array() {
            const words = this._words;
            const nB = this._nSignificantBytes;
            const uint8Array = new Uint8Array(nB);
            for (let i = 0; i < nB; i++) {
                uint8Array[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            }
            return uint8Array;
        }
        /**
         * Concatenates a word array to this word array.
         *
         * @param {Word32Array} w The word array to append.
         * @return {Word32Array} This word array.
         * @example
         *   wordArray1.concat(wordArray2);
         */
        concat(w) {
            const words = w.words.slice();
            const N = w.nSigBytes;
            this.clamp();
            if (this._nSignificantBytes % 4) {
                // Copy one byte at a time
                for (let i = 0; i < N; i++) {
                    const b = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    this._words[(this._nSignificantBytes + i) >>> 2] |= b << (24 - ((this._nSignificantBytes + i) % 4) * 8);
                }
            }
            else {
                // Copy one word at a time
                for (let i = 0; i < N; i += 4) {
                    this._words[(this._nSignificantBytes + i) >>> 2] = words[i >>> 2];
                }
            }
            this._nSignificantBytes += N;
            // Chainable
            return this;
        }
        /**
         * Removes insignificant bits.
         *
         * @example
         *   wordArray.clamp();
         */
        clamp() {
            const n = this._nSignificantBytes;
            this._words[n >>> 2] &= 0xffffffff << (32 - (n % 4) * 8);
            this._words.length = Math.ceil(n / 4);
        }
        /**
         * Creates a copy of this word array.
         *
         * @return {Word32Array} The clone.
         * @example
         *   var clone = word32Array.clone();
         */
        clone() {
            return new Word32Array(this._words.slice(), this._nSignificantBytes);
        }
        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         * @return {Word32Array} The random word array.
         * @static
         * @example
         *   var wordArray = Word32Array.random(16);
         */
        static random(nBytes) {
            const words = [];
            for (let i = 0; i < nBytes; i += 4) {
                words.push(random$1());
            }
            return new Word32Array(words, nBytes);
        }
    }

    const Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {Word32Array} w An array of 32-bit words.
         * @return {string} The Latin1 string.
         * @example
         *   var latin1String = Latin1.stringify(new Word32Array([0x293892], 6));
         */
        stringify(w) {
            const nSig = w.nSigBytes;
            const words = w.words;
            const latin1Chars = [];
            for (let i = 0; i < nSig; i++) {
                const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(byte));
            }
            return latin1Chars.join("");
        },
        /**
         * Converts a latin1 string to a word array.
         *
         * @param {string} latin1Str The latin1 string.
         * @return {Word32Array} The word array.
         * @example
         *   var wordArray = Latin1.parse(latin1Str);
         */
        parse(latin1Str) {
            const Len = latin1Str.length;
            const words = [];
            for (let i = 0; i < Len; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }
            return new Word32Array(words, Len);
        }
    };

    const Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {Word32Array} w An array of 32-bit words.
         * @return {string} The UTF-8 string.
         * @example
         *   var utf8String = Utf8.stringify(new Word32Array([0x293892]));
         */
        stringify(w) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(w)));
            }
            catch (e) {
                throw new Error("Malformed UTF-8 data");
            }
        },
        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         * @return {Word32Array} The word array.
         * @example
         *   var wordArray = Utf8.parse(utf8Str);
         */
        parse(utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };

    class BufferedBlockAlgorithm {
        constructor(props) {
            this._minBufferSize = 0;
            this._blockSize = 0;
            this._props = props;
            this._data = props && typeof props.data !== "undefined" ? props.data.clone() : new Word32Array();
            this._nBytes = props && typeof props.nBytes === "number" ? props.nBytes : 0;
        }
        get blockSize() {
            return this._blockSize;
        }
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *   bufferedBlockAlgorithm.reset();
         */
        reset(data, nBytes) {
            this._data = typeof data !== "undefined" ? data.clone() : new Word32Array();
            this._nBytes = typeof nBytes === "number" ? nBytes : 0;
        }
        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {Word32Array|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         * @example
         *   bufferedBlockAlgorithm.append('data');
         *   bufferedBlockAlgorithm.append(wordArray);
         */
        _append(data) {
            const d = typeof data === "string" ? Utf8.parse(data) : data;
            this._data.concat(d);
            this._nBytes += d.nSigBytes;
        }
        /**
         * Processes available data blocks.
         * This method invokes doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean?} doFlush Whether all blocks and partial blocks should be processed.
         * @return {Word32Array} The processed data.
         * @example
         *   var processedData = bufferedBlockAlgorithm.process();
         *   var processedData = bufferedBlockAlgorithm.process(!!'flush');
         */
        _process(doFlush) {
            let processedWords;
            const words = this._data.words;
            const nSigBytes = this._data.nSigBytes;
            const blockSize = this._blockSize;
            const blockSizeByte = this._blockSize * 4;
            let nBlocksReady = nSigBytes / blockSizeByte;
            if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            }
            else {
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }
            // Count words ready
            const nWordsReady = nBlocksReady * blockSize;
            // Count bytes ready
            const nBytesReady = Math.min(nWordsReady * 4, nSigBytes);
            // Process blocks
            if (nWordsReady) {
                for (let offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(words, offset);
                }
                // Remove processed words
                processedWords = words.splice(0, nWordsReady);
                this._data.nSigBytes -= nBytesReady;
            }
            // Return processed words
            return new Word32Array(processedWords, nBytesReady);
        }
        /**
         * @abstract
         */
        _doProcessBlock(words, offset) {
            throw new Error("Not implemented");
        }
    }

    class Hasher extends BufferedBlockAlgorithm {
        constructor(props) {
            super(props);
            this._blockSize = 512 / 32;
            this._props = props;
            if (props && typeof props.blockSize === "number") {
                this._blockSize = props.blockSize;
            }
            this.reset(props ? props.data : undefined, props ? props.nBytes : undefined);
        }
        get blockSize() {
            return this._blockSize;
        }
        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *   hasher.reset();
         */
        reset(data, nBytes) {
            // Reset data buffer
            super.reset.call(this, data, nBytes);
            // Perform concrete-hasher logic
            this._doReset();
        }
        /**
         * Updates this hasher with a message.
         *
         * @param {Word32Array|string} messageUpdate The message to append.
         * @return {Hasher} This hasher.
         * @example
         *   hasher.update('message');
         *   hasher.update(wordArray);
         */
        update(messageUpdate) {
            this._append(messageUpdate);
            this._process();
            return this;
        }
        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {Word32Array|string?} messageUpdate (Optional) A final message update.
         * @return {Word32Array} The hash.
         * @example
         *   var hash = hasher.finalize();
         *   var hash = hasher.finalize('message');
         *   var hash = hasher.finalize(wordArray);
         */
        finalize(messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this._append(messageUpdate);
            }
            // Perform concrete-hasher logic
            return this._doFinalize();
        }
        /**
         * @abstract
         */
        _doReset() {
            throw new Error("Not implemented");
        }
        /**
         * @abstract
         */
        _doFinalize() {
            throw new Error("Not implemented");
        }
    }

    class Word64 {
        constructor(high, low) {
            this.high = high;
            this.low = low;
        }
        clone() {
            return new Word64(this.high, this.low);
        }
    }
    /**
     * An array of 64bit words
     */
    class Word64Array {
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 64-bit words.
         * @param {number} nSignificantBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *   var wordArray = new Word64Array();
         *   var wordArray = new Word64Array([new Word64(0x00010203, 0x04050607)]);
         *   var wordArray = new Word46Array([new Word64(0x00010203, 0x04050607)], 6);
         */
        constructor(words, nSignificantBytes) {
            this._words = words || [];
            this._nSignificantBytes = typeof nSignificantBytes === "number" ? nSignificantBytes : this._words.length * 8;
        }
        get nSigBytes() {
            return this._nSignificantBytes;
        }
        /**
         * Set significant bytes
         * @param {number} n - significant bytes
         */
        set nSigBytes(n) {
            this._nSignificantBytes = n;
        }
        /**
         * Get raw reference of internal words.
         * Modification of this raw array will affect internal words.
         */
        get words() {
            return this._words;
        }
        /**
         * Converts this 64-bit word array to a 32-bit word array.
         *
         * @return {Word32Array} This word array's data as a 32-bit word array.
         *
         * @example
         *
         *     var x32WordArray = x64WordArray.toX32();
         */
        to32() {
            const words32 = [];
            for (let i = 0; i < this._words.length; i++) {
                const word64 = this._words[i];
                words32.push(word64.high);
                words32.push(word64.low);
            }
            return new Word32Array(words32, this._nSignificantBytes);
        }
        /**
         * Converts this word array to a string.
         *
         * @param {IEncoder?} encoder The encoding strategy to use. Default: CryptoJS.enc.Hex
         * @return {string} The stringified word array.
         * @example
         *   var string = wordArray + '';
         *   var string = wordArray.toString();
         *   var string = wordArray.toString(Utf8);
         */
        toString(encoder) {
            if (!encoder) {
                return Hex.stringify(this.to32());
            }
            return encoder.stringify(this.to32());
        }
        /**
         * Creates a copy of this word array.
         *
         * @return {Word64Array} The clone.
         * @example
         *   var clone = wordArray.clone();
         */
        clone() {
            const words = this._words.slice();
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i].clone();
            }
            return new Word64Array(words, this._nSignificantBytes);
        }
    }

    const K = [
        new Word64(0x428a2f98, 0xd728ae22), new Word64(0x71374491, 0x23ef65cd),
        new Word64(0xb5c0fbcf, 0xec4d3b2f), new Word64(0xe9b5dba5, 0x8189dbbc),
        new Word64(0x3956c25b, 0xf348b538), new Word64(0x59f111f1, 0xb605d019),
        new Word64(0x923f82a4, 0xaf194f9b), new Word64(0xab1c5ed5, 0xda6d8118),
        new Word64(0xd807aa98, 0xa3030242), new Word64(0x12835b01, 0x45706fbe),
        new Word64(0x243185be, 0x4ee4b28c), new Word64(0x550c7dc3, 0xd5ffb4e2),
        new Word64(0x72be5d74, 0xf27b896f), new Word64(0x80deb1fe, 0x3b1696b1),
        new Word64(0x9bdc06a7, 0x25c71235), new Word64(0xc19bf174, 0xcf692694),
        new Word64(0xe49b69c1, 0x9ef14ad2), new Word64(0xefbe4786, 0x384f25e3),
        new Word64(0x0fc19dc6, 0x8b8cd5b5), new Word64(0x240ca1cc, 0x77ac9c65),
        new Word64(0x2de92c6f, 0x592b0275), new Word64(0x4a7484aa, 0x6ea6e483),
        new Word64(0x5cb0a9dc, 0xbd41fbd4), new Word64(0x76f988da, 0x831153b5),
        new Word64(0x983e5152, 0xee66dfab), new Word64(0xa831c66d, 0x2db43210),
        new Word64(0xb00327c8, 0x98fb213f), new Word64(0xbf597fc7, 0xbeef0ee4),
        new Word64(0xc6e00bf3, 0x3da88fc2), new Word64(0xd5a79147, 0x930aa725),
        new Word64(0x06ca6351, 0xe003826f), new Word64(0x14292967, 0x0a0e6e70),
        new Word64(0x27b70a85, 0x46d22ffc), new Word64(0x2e1b2138, 0x5c26c926),
        new Word64(0x4d2c6dfc, 0x5ac42aed), new Word64(0x53380d13, 0x9d95b3df),
        new Word64(0x650a7354, 0x8baf63de), new Word64(0x766a0abb, 0x3c77b2a8),
        new Word64(0x81c2c92e, 0x47edaee6), new Word64(0x92722c85, 0x1482353b),
        new Word64(0xa2bfe8a1, 0x4cf10364), new Word64(0xa81a664b, 0xbc423001),
        new Word64(0xc24b8b70, 0xd0f89791), new Word64(0xc76c51a3, 0x0654be30),
        new Word64(0xd192e819, 0xd6ef5218), new Word64(0xd6990624, 0x5565a910),
        new Word64(0xf40e3585, 0x5771202a), new Word64(0x106aa070, 0x32bbd1b8),
        new Word64(0x19a4c116, 0xb8d2d0c8), new Word64(0x1e376c08, 0x5141ab53),
        new Word64(0x2748774c, 0xdf8eeb99), new Word64(0x34b0bcb5, 0xe19b48a8),
        new Word64(0x391c0cb3, 0xc5c95a63), new Word64(0x4ed8aa4a, 0xe3418acb),
        new Word64(0x5b9cca4f, 0x7763e373), new Word64(0x682e6ff3, 0xd6b2b8a3),
        new Word64(0x748f82ee, 0x5defb2fc), new Word64(0x78a5636f, 0x43172f60),
        new Word64(0x84c87814, 0xa1f0ab72), new Word64(0x8cc70208, 0x1a6439ec),
        new Word64(0x90befffa, 0x23631e28), new Word64(0xa4506ceb, 0xde82bde9),
        new Word64(0xbef9a3f7, 0xb2c67915), new Word64(0xc67178f2, 0xe372532b),
        new Word64(0xca273ece, 0xea26619c), new Word64(0xd186b8c7, 0x21c0c207),
        new Word64(0xeada7dd6, 0xcde0eb1e), new Word64(0xf57d4f7f, 0xee6ed178),
        new Word64(0x06f067aa, 0x72176fba), new Word64(0x0a637dc5, 0xa2c898a6),
        new Word64(0x113f9804, 0xbef90dae), new Word64(0x1b710b35, 0x131c471b),
        new Word64(0x28db77f5, 0x23047d84), new Word64(0x32caab7b, 0x40c72493),
        new Word64(0x3c9ebe0a, 0x15c9bebc), new Word64(0x431d67c4, 0x9c100d4c),
        new Word64(0x4cc5d4be, 0xcb3e42b6), new Word64(0x597f299c, 0xfc657e2a),
        new Word64(0x5fcb6fab, 0x3ad6faec), new Word64(0x6c44198c, 0x4a475817),
    ];
    const W = [];
    (function computeConstants() {
        for (let i = 0; i < 80; i++) {
            W[i] = new Word64(0, 0);
        }
    })();
    class SHA512 extends Hasher {
        constructor(props) {
            super(props);
            this._blockSize = 1024 / 32;
            this._hash = new Word64Array([
                new Word64(0x6a09e667, 0xf3bcc908), new Word64(0xbb67ae85, 0x84caa73b),
                new Word64(0x3c6ef372, 0xfe94f82b), new Word64(0xa54ff53a, 0x5f1d36f1),
                new Word64(0x510e527f, 0xade682d1), new Word64(0x9b05688c, 0x2b3e6c1f),
                new Word64(0x1f83d9ab, 0xfb41bd6b), new Word64(0x5be0cd19, 0x137e2179)
            ]);
            this._props = props;
            if (props && typeof props.hash !== "undefined") {
                this._hash = props.hash.clone();
            }
        }
        _doReset() {
            this._hash = new Word64Array([
                new Word64(0x6a09e667, 0xf3bcc908), new Word64(0xbb67ae85, 0x84caa73b),
                new Word64(0x3c6ef372, 0xfe94f82b), new Word64(0xa54ff53a, 0x5f1d36f1),
                new Word64(0x510e527f, 0xade682d1), new Word64(0x9b05688c, 0x2b3e6c1f),
                new Word64(0x1f83d9ab, 0xfb41bd6b), new Word64(0x5be0cd19, 0x137e2179)
            ]);
        }
        _doProcessBlock(words, offset) {
            // Shortcuts
            const H = this._hash.words;
            const H0 = H[0];
            const H1 = H[1];
            const H2 = H[2];
            const H3 = H[3];
            const H4 = H[4];
            const H5 = H[5];
            const H6 = H[6];
            const H7 = H[7];
            const H0h = H0.high;
            let H0l = H0.low;
            const H1h = H1.high;
            let H1l = H1.low;
            const H2h = H2.high;
            let H2l = H2.low;
            const H3h = H3.high;
            let H3l = H3.low;
            const H4h = H4.high;
            let H4l = H4.low;
            const H5h = H5.high;
            let H5l = H5.low;
            const H6h = H6.high;
            let H6l = H6.low;
            const H7h = H7.high;
            let H7l = H7.low;
            // Working variables
            let ah = H0h;
            let al = H0l;
            let bh = H1h;
            let bl = H1l;
            let ch = H2h;
            let cl = H2l;
            let dh = H3h;
            let dl = H3l;
            let eh = H4h;
            let el = H4l;
            let fh = H5h;
            let fl = H5l;
            let gh = H6h;
            let gl = H6l;
            let hh = H7h;
            let hl = H7l;
            // Rounds
            for (let i = 0; i < 80; i++) {
                let Wil;
                let Wih;
                // Shortcut
                const Wi = W[i];
                // Extend message
                if (i < 16) {
                    Wih = Wi.high = words[offset + i * 2] | 0;
                    Wil = Wi.low = words[offset + i * 2 + 1] | 0;
                }
                else {
                    // Gamma0
                    const gamma0x = W[i - 15];
                    const gamma0xh = gamma0x.high;
                    const gamma0xl = gamma0x.low;
                    const gamma0h = ((gamma0xh >>> 1) | (gamma0xl << 31))
                        ^ ((gamma0xh >>> 8) | (gamma0xl << 24))
                        ^ (gamma0xh >>> 7);
                    const gamma0l = ((gamma0xl >>> 1) | (gamma0xh << 31))
                        ^ ((gamma0xl >>> 8) | (gamma0xh << 24))
                        ^ ((gamma0xl >>> 7) | (gamma0xh << 25));
                    // Gamma1
                    const gamma1x = W[i - 2];
                    const gamma1xh = gamma1x.high;
                    const gamma1xl = gamma1x.low;
                    const gamma1h = ((gamma1xh >>> 19) | (gamma1xl << 13))
                        ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
                    const gamma1l = ((gamma1xl >>> 19) | (gamma1xh << 13))
                        ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));
                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
                    const Wi7 = W[i - 7];
                    const Wi7h = Wi7.high;
                    const Wi7l = Wi7.low;
                    const Wi16 = W[i - 16];
                    const Wi16h = Wi16.high;
                    const Wi16l = Wi16.low;
                    Wil = gamma0l + Wi7l;
                    Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
                    Wil = Wil + gamma1l;
                    Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
                    Wil = Wil + Wi16l;
                    Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);
                    Wi.high = Wih;
                    Wi.low = Wil;
                }
                const chh = (eh & fh) ^ (~eh & gh);
                const chl = (el & fl) ^ (~el & gl);
                const majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
                const majl = (al & bl) ^ (al & cl) ^ (bl & cl);
                const sigma0h = ((ah >>> 28) | (al << 4)) ^ ((ah << 30) | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
                const sigma0l = ((al >>> 28) | (ah << 4)) ^ ((al << 30) | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
                const sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
                const sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));
                // t1 = h + sigma1 + ch + K[i] + W[i]
                const Ki = K[i];
                const Kih = Ki.high;
                const Kil = Ki.low;
                let t1l = hl + sigma1l;
                let t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
                t1l = t1l + chl;
                t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
                t1l = t1l + Kil;
                t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
                t1l = t1l + Wil;
                t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);
                // t2 = sigma0 + maj
                const t2l = sigma0l + majl;
                const t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);
                // Update working variables
                hh = gh;
                hl = gl;
                gh = fh;
                gl = fl;
                fh = eh;
                fl = el;
                el = (dl + t1l) | 0;
                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
                dh = ch;
                dl = cl;
                ch = bh;
                cl = bl;
                bh = ah;
                bl = al;
                al = (t1l + t2l) | 0;
                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
            }
            // Intermediate hash value
            H0l = H0.low = (H0l + al);
            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
            H1l = H1.low = (H1l + bl);
            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
            H2l = H2.low = (H2l + cl);
            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
            H3l = H3.low = (H3l + dl);
            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
            H4l = H4.low = (H4l + el);
            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
            H5l = H5.low = (H5l + fl);
            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
            H6l = H6.low = (H6l + gl);
            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
            H7l = H7.low = (H7l + hl);
            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
        }
        _doFinalize() {
            // Shortcuts
            const data = this._data;
            const dataWords = data.words;
            const nBitsTotal = this._nBytes * 8;
            const nBitsLeft = data.nSigBytes * 8;
            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
            data.nSigBytes = dataWords.length * 4;
            // Hash final blocks
            this._process();
            // Convert hash to 32-bit word array before returning
            return this._hash.to32();
        }
        clone() {
            const props = { hash: this._hash, blockSize: this._blockSize, data: this._data, nBytes: this._nBytes };
            return new SHA512(props);
        }
        static hash(message, props) {
            return new SHA512(props).finalize(message);
        }
    }

    function random(len) {
    	return crypto.getRandomValues(new Uint8Array(len));
    }

    const uint8ArrayToBase64 = async (buf) => {
        let binstr = Array.prototype.map
            .call(buf, function (ch) {
            return String.fromCharCode(ch);
        })
            .join("");
        return btoa(binstr);
    };
    const base64ToUint8Array = async (base64) => {
        let binstr = atob(base64);
        let buf = new Uint8Array(binstr.length);
        Array.prototype.forEach.call(binstr, function (ch, i) {
            buf[i] = ch.charCodeAt(0);
        });
        return buf;
    };
    const arrayBufferToBase64 = async (buffer) => {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    };
    const base64ToArrayBuffer = async (buffer) => {
        return Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
    };

    const encrypt = async (data, key) => {
        const iv = random(96);
        const encryptedData = await crypto.subtle.encrypt({
            name: "AES-GCM",
            iv,
            length: 256,
        }, key, data);
        return {
            iv: await uint8ArrayToBase64(iv),
            data: await arrayBufferToBase64(encryptedData),
        };
    };
    const encryptData = async (data, key) => {
        const iv = random(96);
        const encryptedData = await crypto.subtle.encrypt({
            name: "AES-GCM",
            iv,
            length: 256,
        }, key, data);
        return {
            iv: await uint8ArrayToBase64(iv),
            data: encryptedData,
        };
    };
    const decrypt = async (data, key) => {
        const iv = await base64ToUint8Array(data.iv);
        const encryptedData = await base64ToArrayBuffer(data.data);
        const decryptedData = await crypto.subtle.decrypt({
            name: "AES-GCM",
            iv,
            length: 256,
        }, key, encryptedData);
        return decryptedData;
    };
    const decryptData = async (data, key) => {
        const iv = await base64ToUint8Array(data.iv);
        const decryptedData = await crypto.subtle.decrypt({
            name: "AES-GCM",
            iv,
            length: 256,
        }, key, data.data);
        return decryptedData;
    };
    const deriveKeypair = async (passKey, keySalt) => {
        const enc = new TextEncoder();
        // derive key from passkey using pbkdf2
        const keypair = await window.crypto.subtle.importKey("raw", enc.encode(passKey), {
            name: "PBKDF2",
        }, false, ["deriveBits", "deriveKey"]);
        // create masterkey from key
        const masterKey = await window.crypto.subtle.deriveKey({
            name: "PBKDF2",
            iterations: 200000,
            salt: enc.encode(keySalt),
            hash: "SHA-512",
        }, keypair, {
            name: "AES-GCM",
            length: 256,
        }, true, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);
        return masterKey;
    };

    /* src\components\Message.svelte generated by Svelte v3.58.0 */
    const file$7 = "src\\components\\Message.svelte";

    // (30:4) {#if decryptedMessage && decryptedUsername}
    function create_if_block$1(ctx) {
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let p_class_value;
    	let if_block0 = /*isSystem*/ ctx[0] && create_if_block_2$1(ctx);
    	let if_block1 = !/*group*/ ctx[1] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			p = element("p");
    			t2 = text(/*decryptedMessage*/ ctx[2]);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(`content ${/*group*/ ctx[1] && "no-margin"}`) + " svelte-1o1w7pz"));
    			add_location(p, file$7, 48, 8, 1493);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (/*isSystem*/ ctx[0]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*group*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*decryptedMessage*/ 4) set_data_dev(t2, /*decryptedMessage*/ ctx[2]);

    			if (dirty & /*group*/ 2 && p_class_value !== (p_class_value = "" + (null_to_empty(`content ${/*group*/ ctx[1] && "no-margin"}`) + " svelte-1o1w7pz"))) {
    				attr_dev(p, "class", p_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(30:4) {#if decryptedMessage && decryptedUsername}",
    		ctx
    	});

    	return block;
    }

    // (31:8) {#if isSystem}
    function create_if_block_2$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "ONLY YOU CAN SEE THIS";
    			set_style(p, "color", "gray");
    			set_style(p, "font-size", ".75rem");
    			set_style(p, "margin", "0");
    			add_location(p, file$7, 31, 12, 913);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(31:8) {#if isSystem}",
    		ctx
    	});

    	return block;
    }

    // (36:8) {#if !group}
    function create_if_block_1$1(ctx) {
    	let div;
    	let p0;
    	let t0;
    	let p0_style_value;
    	let t1;
    	let p1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text(/*decryptedUsername*/ ctx[3]);
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = `${/*received*/ ctx[4]}`;
    			attr_dev(p0, "class", "username svelte-1o1w7pz");
    			attr_dev(p0, "style", p0_style_value = `color: ${/*isSystem*/ ctx[0] ? "#C081FF" : "var(--txt-color)"}`);
    			add_location(p0, file$7, 37, 16, 1142);
    			attr_dev(p1, "class", "timestamp svelte-1o1w7pz");
    			add_location(p1, file$7, 45, 16, 1413);
    			set_style(div, "display", "flex");
    			set_style(div, "align-items", "center");
    			add_location(div, file$7, 36, 12, 1075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*decryptedUsername*/ 8) set_data_dev(t0, /*decryptedUsername*/ ctx[3]);

    			if (dirty & /*isSystem*/ 1 && p0_style_value !== (p0_style_value = `color: ${/*isSystem*/ ctx[0] ? "#C081FF" : "var(--txt-color)"}`)) {
    				attr_dev(p0, "style", p0_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(36:8) {#if !group}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let if_block = /*decryptedMessage*/ ctx[2] && /*decryptedUsername*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "container svelte-1o1w7pz");
    			add_location(div, file$7, 28, 0, 803);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*decryptedMessage*/ ctx[2] && /*decryptedUsername*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Message', slots, []);
    	let { username } = $$props;
    	let { content } = $$props;
    	let { isSystem = false } = $$props;
    	let { requiresDecryption = true } = $$props;
    	let { key } = $$props;
    	let { group = false } = $$props;
    	const received = new Date().toLocaleTimeString();
    	let decryptedMessage;
    	let decryptedUsername;
    	const dec = new TextDecoder();

    	onMount(async () => {
    		if (!username || !content) {
    			return;
    		}

    		if (!requiresDecryption) {
    			$$invalidate(3, decryptedUsername = username.data);
    			$$invalidate(2, decryptedMessage = content.data);
    			return;
    		}

    		// decrypt username
    		$$invalidate(3, decryptedUsername = dec.decode(await decrypt(username, key)));

    		// decrypt content
    		$$invalidate(2, decryptedMessage = dec.decode(await decrypt(content, key)));
    	});

    	$$self.$$.on_mount.push(function () {
    		if (username === undefined && !('username' in $$props || $$self.$$.bound[$$self.$$.props['username']])) {
    			console.warn("<Message> was created without expected prop 'username'");
    		}

    		if (content === undefined && !('content' in $$props || $$self.$$.bound[$$self.$$.props['content']])) {
    			console.warn("<Message> was created without expected prop 'content'");
    		}

    		if (key === undefined && !('key' in $$props || $$self.$$.bound[$$self.$$.props['key']])) {
    			console.warn("<Message> was created without expected prop 'key'");
    		}
    	});

    	const writable_props = ['username', 'content', 'isSystem', 'requiresDecryption', 'key', 'group'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Message> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('username' in $$props) $$invalidate(5, username = $$props.username);
    		if ('content' in $$props) $$invalidate(6, content = $$props.content);
    		if ('isSystem' in $$props) $$invalidate(0, isSystem = $$props.isSystem);
    		if ('requiresDecryption' in $$props) $$invalidate(7, requiresDecryption = $$props.requiresDecryption);
    		if ('key' in $$props) $$invalidate(8, key = $$props.key);
    		if ('group' in $$props) $$invalidate(1, group = $$props.group);
    	};

    	$$self.$capture_state = () => ({
    		decrypt,
    		onMount,
    		username,
    		content,
    		isSystem,
    		requiresDecryption,
    		key,
    		group,
    		received,
    		decryptedMessage,
    		decryptedUsername,
    		dec
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(5, username = $$props.username);
    		if ('content' in $$props) $$invalidate(6, content = $$props.content);
    		if ('isSystem' in $$props) $$invalidate(0, isSystem = $$props.isSystem);
    		if ('requiresDecryption' in $$props) $$invalidate(7, requiresDecryption = $$props.requiresDecryption);
    		if ('key' in $$props) $$invalidate(8, key = $$props.key);
    		if ('group' in $$props) $$invalidate(1, group = $$props.group);
    		if ('decryptedMessage' in $$props) $$invalidate(2, decryptedMessage = $$props.decryptedMessage);
    		if ('decryptedUsername' in $$props) $$invalidate(3, decryptedUsername = $$props.decryptedUsername);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isSystem,
    		group,
    		decryptedMessage,
    		decryptedUsername,
    		received,
    		username,
    		content,
    		requiresDecryption,
    		key
    	];
    }

    class Message extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			username: 5,
    			content: 6,
    			isSystem: 0,
    			requiresDecryption: 7,
    			key: 8,
    			group: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Message",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get username() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set username(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSystem() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSystem(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get requiresDecryption() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set requiresDecryption(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-icons\fa\FaArrowAltCircleUp.svelte generated by Svelte v3.58.0 */
    const file$6 = "node_modules\\svelte-icons\\fa\\FaArrowAltCircleUp.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm292 116V256h70.9c10.7 0 16.1-13 8.5-20.5L264.5 121.2c-4.7-4.7-12.2-4.7-16.9 0l-115 114.3c-7.6 7.6-2.2 20.5 8.5 20.5H212v116c0 6.6 5.4 12 12 12h64c6.6 0 12-5.4 12-12z");
    			add_location(path, file$6, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
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
    	validate_slots('FaArrowAltCircleUp', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaArrowAltCircleUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaArrowAltCircleUp",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const PACKET_TYPES = Object.create(null); // no Map = no polyfill
    PACKET_TYPES["open"] = "0";
    PACKET_TYPES["close"] = "1";
    PACKET_TYPES["ping"] = "2";
    PACKET_TYPES["pong"] = "3";
    PACKET_TYPES["message"] = "4";
    PACKET_TYPES["upgrade"] = "5";
    PACKET_TYPES["noop"] = "6";
    const PACKET_TYPES_REVERSE = Object.create(null);
    Object.keys(PACKET_TYPES).forEach(key => {
        PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
    });
    const ERROR_PACKET = { type: "error", data: "parser error" };

    const withNativeBlob$1 = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
    const withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
    // ArrayBuffer.isView method is not defined in IE10
    const isView$1 = obj => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj && obj.buffer instanceof ArrayBuffer;
    };
    const encodePacket = ({ type, data }, supportsBinary, callback) => {
        if (withNativeBlob$1 && data instanceof Blob) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(data, callback);
            }
        }
        else if (withNativeArrayBuffer$2 &&
            (data instanceof ArrayBuffer || isView$1(data))) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(new Blob([data]), callback);
            }
        }
        // plain string
        return callback(PACKET_TYPES[type] + (data || ""));
    };
    const encodeBlobAsBase64 = (data, callback) => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const content = fileReader.result.split(",")[1];
            callback("b" + (content || ""));
        };
        return fileReader.readAsDataURL(data);
    };

    // imported from https://github.com/socketio/base64-arraybuffer
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // Use a lookup table to find the index.
    const lookup$1 = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
        lookup$1[chars.charCodeAt(i)] = i;
    }
    const decode$1 = (base64) => {
        let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }
        const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = lookup$1[base64.charCodeAt(i)];
            encoded2 = lookup$1[base64.charCodeAt(i + 1)];
            encoded3 = lookup$1[base64.charCodeAt(i + 2)];
            encoded4 = lookup$1[base64.charCodeAt(i + 3)];
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    };

    const withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
    const decodePacket = (encodedPacket, binaryType) => {
        if (typeof encodedPacket !== "string") {
            return {
                type: "message",
                data: mapBinary(encodedPacket, binaryType)
            };
        }
        const type = encodedPacket.charAt(0);
        if (type === "b") {
            return {
                type: "message",
                data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
            };
        }
        const packetType = PACKET_TYPES_REVERSE[type];
        if (!packetType) {
            return ERROR_PACKET;
        }
        return encodedPacket.length > 1
            ? {
                type: PACKET_TYPES_REVERSE[type],
                data: encodedPacket.substring(1)
            }
            : {
                type: PACKET_TYPES_REVERSE[type]
            };
    };
    const decodeBase64Packet = (data, binaryType) => {
        if (withNativeArrayBuffer$1) {
            const decoded = decode$1(data);
            return mapBinary(decoded, binaryType);
        }
        else {
            return { base64: true, data }; // fallback for old browsers
        }
    };
    const mapBinary = (data, binaryType) => {
        switch (binaryType) {
            case "blob":
                return data instanceof ArrayBuffer ? new Blob([data]) : data;
            case "arraybuffer":
            default:
                return data; // assuming the data is already an ArrayBuffer
        }
    };

    const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
    const encodePayload = (packets, callback) => {
        // some packets may be added to the array while encoding, so the initial length must be saved
        const length = packets.length;
        const encodedPackets = new Array(length);
        let count = 0;
        packets.forEach((packet, i) => {
            // force base64 encoding for binary packets
            encodePacket(packet, false, encodedPacket => {
                encodedPackets[i] = encodedPacket;
                if (++count === length) {
                    callback(encodedPackets.join(SEPARATOR));
                }
            });
        });
    };
    const decodePayload = (encodedPayload, binaryType) => {
        const encodedPackets = encodedPayload.split(SEPARATOR);
        const packets = [];
        for (let i = 0; i < encodedPackets.length; i++) {
            const decodedPacket = decodePacket(encodedPackets[i], binaryType);
            packets.push(decodedPacket);
            if (decodedPacket.type === "error") {
                break;
            }
        }
        return packets;
    };
    const protocol$1 = 4;

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }

    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      // Remove event specific arrays for event types that no
      // one is subscribed for to avoid memory leak.
      if (callbacks.length === 0) {
        delete this._callbacks['$' + event];
      }

      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};

      var args = new Array(arguments.length - 1)
        , callbacks = this._callbacks['$' + event];

      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    // alias used for reserved events (protected method)
    Emitter.prototype.emitReserved = Emitter.prototype.emit;

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };

    const globalThisShim = (() => {
        if (typeof self !== "undefined") {
            return self;
        }
        else if (typeof window !== "undefined") {
            return window;
        }
        else {
            return Function("return this")();
        }
    })();

    function pick(obj, ...attr) {
        return attr.reduce((acc, k) => {
            if (obj.hasOwnProperty(k)) {
                acc[k] = obj[k];
            }
            return acc;
        }, {});
    }
    // Keep a reference to the real timeout functions so they can be used when overridden
    const NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
    const NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
    function installTimerFunctions(obj, opts) {
        if (opts.useNativeTimers) {
            obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
            obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
        }
        else {
            obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
            obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
        }
    }
    // base64 encoded buffers are about 33% bigger (https://en.wikipedia.org/wiki/Base64)
    const BASE64_OVERHEAD = 1.33;
    // we could also have used `new Blob([obj]).size`, but it isn't supported in IE9
    function byteLength(obj) {
        if (typeof obj === "string") {
            return utf8Length(obj);
        }
        // arraybuffer or blob
        return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
    }
    function utf8Length(str) {
        let c = 0, length = 0;
        for (let i = 0, l = str.length; i < l; i++) {
            c = str.charCodeAt(i);
            if (c < 0x80) {
                length += 1;
            }
            else if (c < 0x800) {
                length += 2;
            }
            else if (c < 0xd800 || c >= 0xe000) {
                length += 3;
            }
            else {
                i++;
                length += 4;
            }
        }
        return length;
    }

    class TransportError extends Error {
        constructor(reason, description, context) {
            super(reason);
            this.description = description;
            this.context = context;
            this.type = "TransportError";
        }
    }
    class Transport extends Emitter {
        /**
         * Transport abstract constructor.
         *
         * @param {Object} opts - options
         * @protected
         */
        constructor(opts) {
            super();
            this.writable = false;
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.query = opts.query;
            this.socket = opts.socket;
        }
        /**
         * Emits an error.
         *
         * @param {String} reason
         * @param description
         * @param context - the error context
         * @return {Transport} for chaining
         * @protected
         */
        onError(reason, description, context) {
            super.emitReserved("error", new TransportError(reason, description, context));
            return this;
        }
        /**
         * Opens the transport.
         */
        open() {
            this.readyState = "opening";
            this.doOpen();
            return this;
        }
        /**
         * Closes the transport.
         */
        close() {
            if (this.readyState === "opening" || this.readyState === "open") {
                this.doClose();
                this.onClose();
            }
            return this;
        }
        /**
         * Sends multiple packets.
         *
         * @param {Array} packets
         */
        send(packets) {
            if (this.readyState === "open") {
                this.write(packets);
            }
        }
        /**
         * Called upon open
         *
         * @protected
         */
        onOpen() {
            this.readyState = "open";
            this.writable = true;
            super.emitReserved("open");
        }
        /**
         * Called with data.
         *
         * @param {String} data
         * @protected
         */
        onData(data) {
            const packet = decodePacket(data, this.socket.binaryType);
            this.onPacket(packet);
        }
        /**
         * Called with a decoded packet.
         *
         * @protected
         */
        onPacket(packet) {
            super.emitReserved("packet", packet);
        }
        /**
         * Called upon close.
         *
         * @protected
         */
        onClose(details) {
            this.readyState = "closed";
            super.emitReserved("close", details);
        }
        /**
         * Pauses the transport, in order not to lose packets during an upgrade.
         *
         * @param onPause
         */
        pause(onPause) { }
    }

    // imported from https://github.com/unshiftio/yeast
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''), length = 64, map = {};
    let seed = 0, i = 0, prev;
    /**
     * Return a string representing the specified number.
     *
     * @param {Number} num The number to convert.
     * @returns {String} The string representation of the number.
     * @api public
     */
    function encode$1(num) {
        let encoded = '';
        do {
            encoded = alphabet[num % length] + encoded;
            num = Math.floor(num / length);
        } while (num > 0);
        return encoded;
    }
    /**
     * Yeast: A tiny growing id generator.
     *
     * @returns {String} A unique id.
     * @api public
     */
    function yeast() {
        const now = encode$1(+new Date());
        if (now !== prev)
            return seed = 0, prev = now;
        return now + '.' + encode$1(seed++);
    }
    //
    // Map each character to its index.
    //
    for (; i < length; i++)
        map[alphabet[i]] = i;

    // imported from https://github.com/galkn/querystring
    /**
     * Compiles a querystring
     * Returns string representation of the object
     *
     * @param {Object}
     * @api private
     */
    function encode(obj) {
        let str = '';
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (str.length)
                    str += '&';
                str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
            }
        }
        return str;
    }
    /**
     * Parses a simple querystring into an object
     *
     * @param {String} qs
     * @api private
     */
    function decode(qs) {
        let qry = {};
        let pairs = qs.split('&');
        for (let i = 0, l = pairs.length; i < l; i++) {
            let pair = pairs[i].split('=');
            qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return qry;
    }

    // imported from https://github.com/component/has-cors
    let value = false;
    try {
        value = typeof XMLHttpRequest !== 'undefined' &&
            'withCredentials' in new XMLHttpRequest();
    }
    catch (err) {
        // if XMLHttp support is disabled in IE then it will throw
        // when trying to create
    }
    const hasCORS = value;

    // browser shim for xmlhttprequest module
    function XHR(opts) {
        const xdomain = opts.xdomain;
        // XMLHttpRequest can be disabled on IE
        try {
            if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
                return new XMLHttpRequest();
            }
        }
        catch (e) { }
        if (!xdomain) {
            try {
                return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
            }
            catch (e) { }
        }
    }

    function empty() { }
    const hasXHR2 = (function () {
        const xhr = new XHR({
            xdomain: false,
        });
        return null != xhr.responseType;
    })();
    class Polling extends Transport {
        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @package
         */
        constructor(opts) {
            super(opts);
            this.polling = false;
            if (typeof location !== "undefined") {
                const isSSL = "https:" === location.protocol;
                let port = location.port;
                // some user agents have empty `location.port`
                if (!port) {
                    port = isSSL ? "443" : "80";
                }
                this.xd =
                    (typeof location !== "undefined" &&
                        opts.hostname !== location.hostname) ||
                        port !== opts.port;
                this.xs = opts.secure !== isSSL;
            }
            /**
             * XHR supports binary
             */
            const forceBase64 = opts && opts.forceBase64;
            this.supportsBinary = hasXHR2 && !forceBase64;
        }
        get name() {
            return "polling";
        }
        /**
         * Opens the socket (triggers polling). We write a PING message to determine
         * when the transport is open.
         *
         * @protected
         */
        doOpen() {
            this.poll();
        }
        /**
         * Pauses polling.
         *
         * @param {Function} onPause - callback upon buffers are flushed and transport is paused
         * @package
         */
        pause(onPause) {
            this.readyState = "pausing";
            const pause = () => {
                this.readyState = "paused";
                onPause();
            };
            if (this.polling || !this.writable) {
                let total = 0;
                if (this.polling) {
                    total++;
                    this.once("pollComplete", function () {
                        --total || pause();
                    });
                }
                if (!this.writable) {
                    total++;
                    this.once("drain", function () {
                        --total || pause();
                    });
                }
            }
            else {
                pause();
            }
        }
        /**
         * Starts polling cycle.
         *
         * @private
         */
        poll() {
            this.polling = true;
            this.doPoll();
            this.emitReserved("poll");
        }
        /**
         * Overloads onData to detect payloads.
         *
         * @protected
         */
        onData(data) {
            const callback = (packet) => {
                // if its the first message we consider the transport open
                if ("opening" === this.readyState && packet.type === "open") {
                    this.onOpen();
                }
                // if its a close packet, we close the ongoing requests
                if ("close" === packet.type) {
                    this.onClose({ description: "transport closed by the server" });
                    return false;
                }
                // otherwise bypass onData and handle the message
                this.onPacket(packet);
            };
            // decode payload
            decodePayload(data, this.socket.binaryType).forEach(callback);
            // if an event did not trigger closing
            if ("closed" !== this.readyState) {
                // if we got data we're not polling
                this.polling = false;
                this.emitReserved("pollComplete");
                if ("open" === this.readyState) {
                    this.poll();
                }
            }
        }
        /**
         * For polling, send a close packet.
         *
         * @protected
         */
        doClose() {
            const close = () => {
                this.write([{ type: "close" }]);
            };
            if ("open" === this.readyState) {
                close();
            }
            else {
                // in case we're trying to close while
                // handshaking is in progress (GH-164)
                this.once("open", close);
            }
        }
        /**
         * Writes a packets payload.
         *
         * @param {Array} packets - data packets
         * @protected
         */
        write(packets) {
            this.writable = false;
            encodePayload(packets, (data) => {
                this.doWrite(data, () => {
                    this.writable = true;
                    this.emitReserved("drain");
                });
            });
        }
        /**
         * Generates uri for connection.
         *
         * @private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "https" : "http";
            let port = "";
            // cache busting is forced
            if (false !== this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            if (!this.supportsBinary && !query.sid) {
                query.b64 = 1;
            }
            // avoid port if default for schema
            if (this.opts.port &&
                (("https" === schema && Number(this.opts.port) !== 443) ||
                    ("http" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Creates a request.
         *
         * @param {String} method
         * @private
         */
        request(opts = {}) {
            Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
            return new Request(this.uri(), opts);
        }
        /**
         * Sends data.
         *
         * @param {String} data to send.
         * @param {Function} called upon flush.
         * @private
         */
        doWrite(data, fn) {
            const req = this.request({
                method: "POST",
                data: data,
            });
            req.on("success", fn);
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr post error", xhrStatus, context);
            });
        }
        /**
         * Starts a poll cycle.
         *
         * @private
         */
        doPoll() {
            const req = this.request();
            req.on("data", this.onData.bind(this));
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr poll error", xhrStatus, context);
            });
            this.pollXhr = req;
        }
    }
    class Request extends Emitter {
        /**
         * Request constructor
         *
         * @param {Object} options
         * @package
         */
        constructor(uri, opts) {
            super();
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.method = opts.method || "GET";
            this.uri = uri;
            this.async = false !== opts.async;
            this.data = undefined !== opts.data ? opts.data : null;
            this.create();
        }
        /**
         * Creates the XHR object and sends the request.
         *
         * @private
         */
        create() {
            const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
            opts.xdomain = !!this.opts.xd;
            opts.xscheme = !!this.opts.xs;
            const xhr = (this.xhr = new XHR(opts));
            try {
                xhr.open(this.method, this.uri, this.async);
                try {
                    if (this.opts.extraHeaders) {
                        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                        for (let i in this.opts.extraHeaders) {
                            if (this.opts.extraHeaders.hasOwnProperty(i)) {
                                xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                            }
                        }
                    }
                }
                catch (e) { }
                if ("POST" === this.method) {
                    try {
                        xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                    }
                    catch (e) { }
                }
                try {
                    xhr.setRequestHeader("Accept", "*/*");
                }
                catch (e) { }
                // ie6 check
                if ("withCredentials" in xhr) {
                    xhr.withCredentials = this.opts.withCredentials;
                }
                if (this.opts.requestTimeout) {
                    xhr.timeout = this.opts.requestTimeout;
                }
                xhr.onreadystatechange = () => {
                    if (4 !== xhr.readyState)
                        return;
                    if (200 === xhr.status || 1223 === xhr.status) {
                        this.onLoad();
                    }
                    else {
                        // make sure the `error` event handler that's user-set
                        // does not throw in the same tick and gets caught here
                        this.setTimeoutFn(() => {
                            this.onError(typeof xhr.status === "number" ? xhr.status : 0);
                        }, 0);
                    }
                };
                xhr.send(this.data);
            }
            catch (e) {
                // Need to defer since .create() is called directly from the constructor
                // and thus the 'error' event can only be only bound *after* this exception
                // occurs.  Therefore, also, we cannot throw here at all.
                this.setTimeoutFn(() => {
                    this.onError(e);
                }, 0);
                return;
            }
            if (typeof document !== "undefined") {
                this.index = Request.requestsCount++;
                Request.requests[this.index] = this;
            }
        }
        /**
         * Called upon error.
         *
         * @private
         */
        onError(err) {
            this.emitReserved("error", err, this.xhr);
            this.cleanup(true);
        }
        /**
         * Cleans up house.
         *
         * @private
         */
        cleanup(fromError) {
            if ("undefined" === typeof this.xhr || null === this.xhr) {
                return;
            }
            this.xhr.onreadystatechange = empty;
            if (fromError) {
                try {
                    this.xhr.abort();
                }
                catch (e) { }
            }
            if (typeof document !== "undefined") {
                delete Request.requests[this.index];
            }
            this.xhr = null;
        }
        /**
         * Called upon load.
         *
         * @private
         */
        onLoad() {
            const data = this.xhr.responseText;
            if (data !== null) {
                this.emitReserved("data", data);
                this.emitReserved("success");
                this.cleanup();
            }
        }
        /**
         * Aborts the request.
         *
         * @package
         */
        abort() {
            this.cleanup();
        }
    }
    Request.requestsCount = 0;
    Request.requests = {};
    /**
     * Aborts pending requests when unloading the window. This is needed to prevent
     * memory leaks (e.g. when using IE) and to ensure that no spurious error is
     * emitted.
     */
    if (typeof document !== "undefined") {
        // @ts-ignore
        if (typeof attachEvent === "function") {
            // @ts-ignore
            attachEvent("onunload", unloadHandler);
        }
        else if (typeof addEventListener === "function") {
            const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
            addEventListener(terminationEvent, unloadHandler, false);
        }
    }
    function unloadHandler() {
        for (let i in Request.requests) {
            if (Request.requests.hasOwnProperty(i)) {
                Request.requests[i].abort();
            }
        }
    }

    const nextTick = (() => {
        const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
        if (isPromiseAvailable) {
            return (cb) => Promise.resolve().then(cb);
        }
        else {
            return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
        }
    })();
    const WebSocket = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
    const usingBrowserWebSocket = true;
    const defaultBinaryType = "arraybuffer";

    // detect ReactNative environment
    const isReactNative = typeof navigator !== "undefined" &&
        typeof navigator.product === "string" &&
        navigator.product.toLowerCase() === "reactnative";
    class WS extends Transport {
        /**
         * WebSocket transport constructor.
         *
         * @param {Object} opts - connection options
         * @protected
         */
        constructor(opts) {
            super(opts);
            this.supportsBinary = !opts.forceBase64;
        }
        get name() {
            return "websocket";
        }
        doOpen() {
            if (!this.check()) {
                // let probe timeout
                return;
            }
            const uri = this.uri();
            const protocols = this.opts.protocols;
            // React Native only supports the 'headers' option, and will print a warning if anything else is passed
            const opts = isReactNative
                ? {}
                : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
            if (this.opts.extraHeaders) {
                opts.headers = this.opts.extraHeaders;
            }
            try {
                this.ws =
                    usingBrowserWebSocket && !isReactNative
                        ? protocols
                            ? new WebSocket(uri, protocols)
                            : new WebSocket(uri)
                        : new WebSocket(uri, protocols, opts);
            }
            catch (err) {
                return this.emitReserved("error", err);
            }
            this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
            this.addEventListeners();
        }
        /**
         * Adds event listeners to the socket
         *
         * @private
         */
        addEventListeners() {
            this.ws.onopen = () => {
                if (this.opts.autoUnref) {
                    this.ws._socket.unref();
                }
                this.onOpen();
            };
            this.ws.onclose = (closeEvent) => this.onClose({
                description: "websocket connection closed",
                context: closeEvent,
            });
            this.ws.onmessage = (ev) => this.onData(ev.data);
            this.ws.onerror = (e) => this.onError("websocket error", e);
        }
        write(packets) {
            this.writable = false;
            // encodePacket efficient as it uses WS framing
            // no need for encodePayload
            for (let i = 0; i < packets.length; i++) {
                const packet = packets[i];
                const lastPacket = i === packets.length - 1;
                encodePacket(packet, this.supportsBinary, (data) => {
                    // always create a new object (GH-437)
                    const opts = {};
                    // Sometimes the websocket has already been closed but the browser didn't
                    // have a chance of informing us about it yet, in that case send will
                    // throw an error
                    try {
                        if (usingBrowserWebSocket) {
                            // TypeError is thrown when passing the second argument on Safari
                            this.ws.send(data);
                        }
                    }
                    catch (e) {
                    }
                    if (lastPacket) {
                        // fake drain
                        // defer to next tick to allow Socket to clear writeBuffer
                        nextTick(() => {
                            this.writable = true;
                            this.emitReserved("drain");
                        }, this.setTimeoutFn);
                    }
                });
            }
        }
        doClose() {
            if (typeof this.ws !== "undefined") {
                this.ws.close();
                this.ws = null;
            }
        }
        /**
         * Generates uri for connection.
         *
         * @private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "wss" : "ws";
            let port = "";
            // avoid port if default for schema
            if (this.opts.port &&
                (("wss" === schema && Number(this.opts.port) !== 443) ||
                    ("ws" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            // append timestamp to URI
            if (this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            // communicate binary support capabilities
            if (!this.supportsBinary) {
                query.b64 = 1;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Feature detection for WebSocket.
         *
         * @return {Boolean} whether this transport is available.
         * @private
         */
        check() {
            return !!WebSocket;
        }
    }

    const transports = {
        websocket: WS,
        polling: Polling,
    };

    // imported from https://github.com/galkn/parseuri
    /**
     * Parses a URI
     *
     * Note: we could also have used the built-in URL object, but it isn't supported on all platforms.
     *
     * See:
     * - https://developer.mozilla.org/en-US/docs/Web/API/URL
     * - https://caniuse.com/url
     * - https://www.rfc-editor.org/rfc/rfc3986#appendix-B
     *
     * History of the parse() method:
     * - first commit: https://github.com/socketio/socket.io-client/commit/4ee1d5d94b3906a9c052b459f1a818b15f38f91c
     * - export into its own module: https://github.com/socketio/engine.io-client/commit/de2c561e4564efeb78f1bdb1ba39ef81b2822cb3
     * - reimport: https://github.com/socketio/engine.io-client/commit/df32277c3f6d622eec5ed09f493cae3f3391d242
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */
    const re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
    const parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];
    function parse(str) {
        const src = str, b = str.indexOf('['), e = str.indexOf(']');
        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }
        let m = re.exec(str || ''), uri = {}, i = 14;
        while (i--) {
            uri[parts[i]] = m[i] || '';
        }
        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }
        uri.pathNames = pathNames(uri, uri['path']);
        uri.queryKey = queryKey(uri, uri['query']);
        return uri;
    }
    function pathNames(obj, path) {
        const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
        if (path.slice(0, 1) == '/' || path.length === 0) {
            names.splice(0, 1);
        }
        if (path.slice(-1) == '/') {
            names.splice(names.length - 1, 1);
        }
        return names;
    }
    function queryKey(uri, query) {
        const data = {};
        query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
            if ($1) {
                data[$1] = $2;
            }
        });
        return data;
    }

    class Socket$1 extends Emitter {
        /**
         * Socket constructor.
         *
         * @param {String|Object} uri - uri or options
         * @param {Object} opts - options
         */
        constructor(uri, opts = {}) {
            super();
            this.writeBuffer = [];
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = null;
            }
            if (uri) {
                uri = parse(uri);
                opts.hostname = uri.host;
                opts.secure = uri.protocol === "https" || uri.protocol === "wss";
                opts.port = uri.port;
                if (uri.query)
                    opts.query = uri.query;
            }
            else if (opts.host) {
                opts.hostname = parse(opts.host).host;
            }
            installTimerFunctions(this, opts);
            this.secure =
                null != opts.secure
                    ? opts.secure
                    : typeof location !== "undefined" && "https:" === location.protocol;
            if (opts.hostname && !opts.port) {
                // if no port is specified manually, use the protocol default
                opts.port = this.secure ? "443" : "80";
            }
            this.hostname =
                opts.hostname ||
                    (typeof location !== "undefined" ? location.hostname : "localhost");
            this.port =
                opts.port ||
                    (typeof location !== "undefined" && location.port
                        ? location.port
                        : this.secure
                            ? "443"
                            : "80");
            this.transports = opts.transports || ["polling", "websocket"];
            this.writeBuffer = [];
            this.prevBufferLen = 0;
            this.opts = Object.assign({
                path: "/engine.io",
                agent: false,
                withCredentials: false,
                upgrade: true,
                timestampParam: "t",
                rememberUpgrade: false,
                addTrailingSlash: true,
                rejectUnauthorized: true,
                perMessageDeflate: {
                    threshold: 1024,
                },
                transportOptions: {},
                closeOnBeforeunload: true,
            }, opts);
            this.opts.path =
                this.opts.path.replace(/\/$/, "") +
                    (this.opts.addTrailingSlash ? "/" : "");
            if (typeof this.opts.query === "string") {
                this.opts.query = decode(this.opts.query);
            }
            // set on handshake
            this.id = null;
            this.upgrades = null;
            this.pingInterval = null;
            this.pingTimeout = null;
            // set on heartbeat
            this.pingTimeoutTimer = null;
            if (typeof addEventListener === "function") {
                if (this.opts.closeOnBeforeunload) {
                    // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                    // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                    // closed/reloaded)
                    this.beforeunloadEventListener = () => {
                        if (this.transport) {
                            // silently close the transport
                            this.transport.removeAllListeners();
                            this.transport.close();
                        }
                    };
                    addEventListener("beforeunload", this.beforeunloadEventListener, false);
                }
                if (this.hostname !== "localhost") {
                    this.offlineEventListener = () => {
                        this.onClose("transport close", {
                            description: "network connection lost",
                        });
                    };
                    addEventListener("offline", this.offlineEventListener, false);
                }
            }
            this.open();
        }
        /**
         * Creates transport of the given type.
         *
         * @param {String} name - transport name
         * @return {Transport}
         * @private
         */
        createTransport(name) {
            const query = Object.assign({}, this.opts.query);
            // append engine.io protocol identifier
            query.EIO = protocol$1;
            // transport name
            query.transport = name;
            // session id if we already have one
            if (this.id)
                query.sid = this.id;
            const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
                query,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port,
            });
            return new transports[name](opts);
        }
        /**
         * Initializes transport to use and starts probe.
         *
         * @private
         */
        open() {
            let transport;
            if (this.opts.rememberUpgrade &&
                Socket$1.priorWebsocketSuccess &&
                this.transports.indexOf("websocket") !== -1) {
                transport = "websocket";
            }
            else if (0 === this.transports.length) {
                // Emit error on next tick so it can be listened to
                this.setTimeoutFn(() => {
                    this.emitReserved("error", "No transports available");
                }, 0);
                return;
            }
            else {
                transport = this.transports[0];
            }
            this.readyState = "opening";
            // Retry with the next transport if the transport is disabled (jsonp: false)
            try {
                transport = this.createTransport(transport);
            }
            catch (e) {
                this.transports.shift();
                this.open();
                return;
            }
            transport.open();
            this.setTransport(transport);
        }
        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @private
         */
        setTransport(transport) {
            if (this.transport) {
                this.transport.removeAllListeners();
            }
            // set up transport
            this.transport = transport;
            // set up transport listeners
            transport
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", (reason) => this.onClose("transport close", reason));
        }
        /**
         * Probes a transport.
         *
         * @param {String} name - transport name
         * @private
         */
        probe(name) {
            let transport = this.createTransport(name);
            let failed = false;
            Socket$1.priorWebsocketSuccess = false;
            const onTransportOpen = () => {
                if (failed)
                    return;
                transport.send([{ type: "ping", data: "probe" }]);
                transport.once("packet", (msg) => {
                    if (failed)
                        return;
                    if ("pong" === msg.type && "probe" === msg.data) {
                        this.upgrading = true;
                        this.emitReserved("upgrading", transport);
                        if (!transport)
                            return;
                        Socket$1.priorWebsocketSuccess = "websocket" === transport.name;
                        this.transport.pause(() => {
                            if (failed)
                                return;
                            if ("closed" === this.readyState)
                                return;
                            cleanup();
                            this.setTransport(transport);
                            transport.send([{ type: "upgrade" }]);
                            this.emitReserved("upgrade", transport);
                            transport = null;
                            this.upgrading = false;
                            this.flush();
                        });
                    }
                    else {
                        const err = new Error("probe error");
                        // @ts-ignore
                        err.transport = transport.name;
                        this.emitReserved("upgradeError", err);
                    }
                });
            };
            function freezeTransport() {
                if (failed)
                    return;
                // Any callback called by transport should be ignored since now
                failed = true;
                cleanup();
                transport.close();
                transport = null;
            }
            // Handle any error that happens while probing
            const onerror = (err) => {
                const error = new Error("probe error: " + err);
                // @ts-ignore
                error.transport = transport.name;
                freezeTransport();
                this.emitReserved("upgradeError", error);
            };
            function onTransportClose() {
                onerror("transport closed");
            }
            // When the socket is closed while we're probing
            function onclose() {
                onerror("socket closed");
            }
            // When the socket is upgraded while we're probing
            function onupgrade(to) {
                if (transport && to.name !== transport.name) {
                    freezeTransport();
                }
            }
            // Remove all listeners on the transport and on self
            const cleanup = () => {
                transport.removeListener("open", onTransportOpen);
                transport.removeListener("error", onerror);
                transport.removeListener("close", onTransportClose);
                this.off("close", onclose);
                this.off("upgrading", onupgrade);
            };
            transport.once("open", onTransportOpen);
            transport.once("error", onerror);
            transport.once("close", onTransportClose);
            this.once("close", onclose);
            this.once("upgrading", onupgrade);
            transport.open();
        }
        /**
         * Called when connection is deemed open.
         *
         * @private
         */
        onOpen() {
            this.readyState = "open";
            Socket$1.priorWebsocketSuccess = "websocket" === this.transport.name;
            this.emitReserved("open");
            this.flush();
            // we check for `readyState` in case an `open`
            // listener already closed the socket
            if ("open" === this.readyState && this.opts.upgrade) {
                let i = 0;
                const l = this.upgrades.length;
                for (; i < l; i++) {
                    this.probe(this.upgrades[i]);
                }
            }
        }
        /**
         * Handles a packet.
         *
         * @private
         */
        onPacket(packet) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                this.emitReserved("packet", packet);
                // Socket is live - any packet counts
                this.emitReserved("heartbeat");
                switch (packet.type) {
                    case "open":
                        this.onHandshake(JSON.parse(packet.data));
                        break;
                    case "ping":
                        this.resetPingTimeout();
                        this.sendPacket("pong");
                        this.emitReserved("ping");
                        this.emitReserved("pong");
                        break;
                    case "error":
                        const err = new Error("server error");
                        // @ts-ignore
                        err.code = packet.data;
                        this.onError(err);
                        break;
                    case "message":
                        this.emitReserved("data", packet.data);
                        this.emitReserved("message", packet.data);
                        break;
                }
            }
        }
        /**
         * Called upon handshake completion.
         *
         * @param {Object} data - handshake obj
         * @private
         */
        onHandshake(data) {
            this.emitReserved("handshake", data);
            this.id = data.sid;
            this.transport.query.sid = data.sid;
            this.upgrades = this.filterUpgrades(data.upgrades);
            this.pingInterval = data.pingInterval;
            this.pingTimeout = data.pingTimeout;
            this.maxPayload = data.maxPayload;
            this.onOpen();
            // In case open handler closes socket
            if ("closed" === this.readyState)
                return;
            this.resetPingTimeout();
        }
        /**
         * Sets and resets ping timeout timer based on server pings.
         *
         * @private
         */
        resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer);
            this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
            }, this.pingInterval + this.pingTimeout);
            if (this.opts.autoUnref) {
                this.pingTimeoutTimer.unref();
            }
        }
        /**
         * Called on `drain` event
         *
         * @private
         */
        onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen);
            // setting prevBufferLen = 0 is very important
            // for example, when upgrading, upgrade packet is sent over,
            // and a nonzero prevBufferLen could cause problems on `drain`
            this.prevBufferLen = 0;
            if (0 === this.writeBuffer.length) {
                this.emitReserved("drain");
            }
            else {
                this.flush();
            }
        }
        /**
         * Flush write buffers.
         *
         * @private
         */
        flush() {
            if ("closed" !== this.readyState &&
                this.transport.writable &&
                !this.upgrading &&
                this.writeBuffer.length) {
                const packets = this.getWritablePackets();
                this.transport.send(packets);
                // keep track of current length of writeBuffer
                // splice writeBuffer and callbackBuffer on `drain`
                this.prevBufferLen = packets.length;
                this.emitReserved("flush");
            }
        }
        /**
         * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
         * long-polling)
         *
         * @private
         */
        getWritablePackets() {
            const shouldCheckPayloadSize = this.maxPayload &&
                this.transport.name === "polling" &&
                this.writeBuffer.length > 1;
            if (!shouldCheckPayloadSize) {
                return this.writeBuffer;
            }
            let payloadSize = 1; // first packet type
            for (let i = 0; i < this.writeBuffer.length; i++) {
                const data = this.writeBuffer[i].data;
                if (data) {
                    payloadSize += byteLength(data);
                }
                if (i > 0 && payloadSize > this.maxPayload) {
                    return this.writeBuffer.slice(0, i);
                }
                payloadSize += 2; // separator + packet type
            }
            return this.writeBuffer;
        }
        /**
         * Sends a message.
         *
         * @param {String} msg - message.
         * @param {Object} options.
         * @param {Function} callback function.
         * @return {Socket} for chaining.
         */
        write(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        send(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        /**
         * Sends a packet.
         *
         * @param {String} type: packet type.
         * @param {String} data.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @private
         */
        sendPacket(type, data, options, fn) {
            if ("function" === typeof data) {
                fn = data;
                data = undefined;
            }
            if ("function" === typeof options) {
                fn = options;
                options = null;
            }
            if ("closing" === this.readyState || "closed" === this.readyState) {
                return;
            }
            options = options || {};
            options.compress = false !== options.compress;
            const packet = {
                type: type,
                data: data,
                options: options,
            };
            this.emitReserved("packetCreate", packet);
            this.writeBuffer.push(packet);
            if (fn)
                this.once("flush", fn);
            this.flush();
        }
        /**
         * Closes the connection.
         */
        close() {
            const close = () => {
                this.onClose("forced close");
                this.transport.close();
            };
            const cleanupAndClose = () => {
                this.off("upgrade", cleanupAndClose);
                this.off("upgradeError", cleanupAndClose);
                close();
            };
            const waitForUpgrade = () => {
                // wait for upgrade to finish since we can't send packets while pausing a transport
                this.once("upgrade", cleanupAndClose);
                this.once("upgradeError", cleanupAndClose);
            };
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.readyState = "closing";
                if (this.writeBuffer.length) {
                    this.once("drain", () => {
                        if (this.upgrading) {
                            waitForUpgrade();
                        }
                        else {
                            close();
                        }
                    });
                }
                else if (this.upgrading) {
                    waitForUpgrade();
                }
                else {
                    close();
                }
            }
            return this;
        }
        /**
         * Called upon transport error
         *
         * @private
         */
        onError(err) {
            Socket$1.priorWebsocketSuccess = false;
            this.emitReserved("error", err);
            this.onClose("transport error", err);
        }
        /**
         * Called upon transport close.
         *
         * @private
         */
        onClose(reason, description) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                // clear timers
                this.clearTimeoutFn(this.pingTimeoutTimer);
                // stop event from firing again for transport
                this.transport.removeAllListeners("close");
                // ensure transport won't stay open
                this.transport.close();
                // ignore further transport communication
                this.transport.removeAllListeners();
                if (typeof removeEventListener === "function") {
                    removeEventListener("beforeunload", this.beforeunloadEventListener, false);
                    removeEventListener("offline", this.offlineEventListener, false);
                }
                // set ready state
                this.readyState = "closed";
                // clear session id
                this.id = null;
                // emit close event
                this.emitReserved("close", reason, description);
                // clean buffers after, so users can still
                // grab the buffers on `close` event
                this.writeBuffer = [];
                this.prevBufferLen = 0;
            }
        }
        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} upgrades - server upgrades
         * @private
         */
        filterUpgrades(upgrades) {
            const filteredUpgrades = [];
            let i = 0;
            const j = upgrades.length;
            for (; i < j; i++) {
                if (~this.transports.indexOf(upgrades[i]))
                    filteredUpgrades.push(upgrades[i]);
            }
            return filteredUpgrades;
        }
    }
    Socket$1.protocol = protocol$1;

    /**
     * URL parser.
     *
     * @param uri - url
     * @param path - the request path of the connection
     * @param loc - An object meant to mimic window.location.
     *        Defaults to window.location.
     * @public
     */
    function url(uri, path = "", loc) {
        let obj = uri;
        // default to window.location
        loc = loc || (typeof location !== "undefined" && location);
        if (null == uri)
            uri = loc.protocol + "//" + loc.host;
        // relative path support
        if (typeof uri === "string") {
            if ("/" === uri.charAt(0)) {
                if ("/" === uri.charAt(1)) {
                    uri = loc.protocol + uri;
                }
                else {
                    uri = loc.host + uri;
                }
            }
            if (!/^(https?|wss?):\/\//.test(uri)) {
                if ("undefined" !== typeof loc) {
                    uri = loc.protocol + "//" + uri;
                }
                else {
                    uri = "https://" + uri;
                }
            }
            // parse
            obj = parse(uri);
        }
        // make sure we treat `localhost:80` and `localhost` equally
        if (!obj.port) {
            if (/^(http|ws)$/.test(obj.protocol)) {
                obj.port = "80";
            }
            else if (/^(http|ws)s$/.test(obj.protocol)) {
                obj.port = "443";
            }
        }
        obj.path = obj.path || "/";
        const ipv6 = obj.host.indexOf(":") !== -1;
        const host = ipv6 ? "[" + obj.host + "]" : obj.host;
        // define unique id
        obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
        // define href
        obj.href =
            obj.protocol +
                "://" +
                host +
                (loc && loc.port === obj.port ? "" : ":" + obj.port);
        return obj;
    }

    const withNativeArrayBuffer = typeof ArrayBuffer === "function";
    const isView = (obj) => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj.buffer instanceof ArrayBuffer;
    };
    const toString$1 = Object.prototype.toString;
    const withNativeBlob = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            toString$1.call(Blob) === "[object BlobConstructor]");
    const withNativeFile = typeof File === "function" ||
        (typeof File !== "undefined" &&
            toString$1.call(File) === "[object FileConstructor]");
    /**
     * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
     *
     * @private
     */
    function isBinary(obj) {
        return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
            (withNativeBlob && obj instanceof Blob) ||
            (withNativeFile && obj instanceof File));
    }
    function hasBinary(obj, toJSON) {
        if (!obj || typeof obj !== "object") {
            return false;
        }
        if (Array.isArray(obj)) {
            for (let i = 0, l = obj.length; i < l; i++) {
                if (hasBinary(obj[i])) {
                    return true;
                }
            }
            return false;
        }
        if (isBinary(obj)) {
            return true;
        }
        if (obj.toJSON &&
            typeof obj.toJSON === "function" &&
            arguments.length === 1) {
            return hasBinary(obj.toJSON(), true);
        }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
     *
     * @param {Object} packet - socket.io event packet
     * @return {Object} with deconstructed packet and list of buffers
     * @public
     */
    function deconstructPacket(packet) {
        const buffers = [];
        const packetData = packet.data;
        const pack = packet;
        pack.data = _deconstructPacket(packetData, buffers);
        pack.attachments = buffers.length; // number of binary 'attachments'
        return { packet: pack, buffers: buffers };
    }
    function _deconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (isBinary(data)) {
            const placeholder = { _placeholder: true, num: buffers.length };
            buffers.push(data);
            return placeholder;
        }
        else if (Array.isArray(data)) {
            const newData = new Array(data.length);
            for (let i = 0; i < data.length; i++) {
                newData[i] = _deconstructPacket(data[i], buffers);
            }
            return newData;
        }
        else if (typeof data === "object" && !(data instanceof Date)) {
            const newData = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    newData[key] = _deconstructPacket(data[key], buffers);
                }
            }
            return newData;
        }
        return data;
    }
    /**
     * Reconstructs a binary packet from its placeholder packet and buffers
     *
     * @param {Object} packet - event packet with placeholders
     * @param {Array} buffers - binary buffers to put in placeholder positions
     * @return {Object} reconstructed packet
     * @public
     */
    function reconstructPacket(packet, buffers) {
        packet.data = _reconstructPacket(packet.data, buffers);
        delete packet.attachments; // no longer useful
        return packet;
    }
    function _reconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (data && data._placeholder === true) {
            const isIndexValid = typeof data.num === "number" &&
                data.num >= 0 &&
                data.num < buffers.length;
            if (isIndexValid) {
                return buffers[data.num]; // appropriate buffer (should be natural order anyway)
            }
            else {
                throw new Error("illegal attachments");
            }
        }
        else if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                data[i] = _reconstructPacket(data[i], buffers);
            }
        }
        else if (typeof data === "object") {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    data[key] = _reconstructPacket(data[key], buffers);
                }
            }
        }
        return data;
    }

    /**
     * Protocol version.
     *
     * @public
     */
    const protocol = 5;
    var PacketType;
    (function (PacketType) {
        PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
        PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
        PacketType[PacketType["EVENT"] = 2] = "EVENT";
        PacketType[PacketType["ACK"] = 3] = "ACK";
        PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
        PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
        PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
    })(PacketType || (PacketType = {}));
    /**
     * A socket.io Encoder instance
     */
    class Encoder {
        /**
         * Encoder constructor
         *
         * @param {function} replacer - custom replacer to pass down to JSON.parse
         */
        constructor(replacer) {
            this.replacer = replacer;
        }
        /**
         * Encode a packet as a single string if non-binary, or as a
         * buffer sequence, depending on packet type.
         *
         * @param {Object} obj - packet object
         */
        encode(obj) {
            if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
                if (hasBinary(obj)) {
                    return this.encodeAsBinary({
                        type: obj.type === PacketType.EVENT
                            ? PacketType.BINARY_EVENT
                            : PacketType.BINARY_ACK,
                        nsp: obj.nsp,
                        data: obj.data,
                        id: obj.id,
                    });
                }
            }
            return [this.encodeAsString(obj)];
        }
        /**
         * Encode packet as string.
         */
        encodeAsString(obj) {
            // first is type
            let str = "" + obj.type;
            // attachments if we have them
            if (obj.type === PacketType.BINARY_EVENT ||
                obj.type === PacketType.BINARY_ACK) {
                str += obj.attachments + "-";
            }
            // if we have a namespace other than `/`
            // we append it followed by a comma `,`
            if (obj.nsp && "/" !== obj.nsp) {
                str += obj.nsp + ",";
            }
            // immediately followed by the id
            if (null != obj.id) {
                str += obj.id;
            }
            // json data
            if (null != obj.data) {
                str += JSON.stringify(obj.data, this.replacer);
            }
            return str;
        }
        /**
         * Encode packet as 'buffer sequence' by removing blobs, and
         * deconstructing packet into object with placeholders and
         * a list of buffers.
         */
        encodeAsBinary(obj) {
            const deconstruction = deconstructPacket(obj);
            const pack = this.encodeAsString(deconstruction.packet);
            const buffers = deconstruction.buffers;
            buffers.unshift(pack); // add packet info to beginning of data list
            return buffers; // write all the buffers
        }
    }
    /**
     * A socket.io Decoder instance
     *
     * @return {Object} decoder
     */
    class Decoder extends Emitter {
        /**
         * Decoder constructor
         *
         * @param {function} reviver - custom reviver to pass down to JSON.stringify
         */
        constructor(reviver) {
            super();
            this.reviver = reviver;
        }
        /**
         * Decodes an encoded packet string into packet JSON.
         *
         * @param {String} obj - encoded packet
         */
        add(obj) {
            let packet;
            if (typeof obj === "string") {
                if (this.reconstructor) {
                    throw new Error("got plaintext data when reconstructing a packet");
                }
                packet = this.decodeString(obj);
                const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
                if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
                    packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
                    // binary packet's json
                    this.reconstructor = new BinaryReconstructor(packet);
                    // no attachments, labeled binary but no binary data to follow
                    if (packet.attachments === 0) {
                        super.emitReserved("decoded", packet);
                    }
                }
                else {
                    // non-binary full packet
                    super.emitReserved("decoded", packet);
                }
            }
            else if (isBinary(obj) || obj.base64) {
                // raw binary data
                if (!this.reconstructor) {
                    throw new Error("got binary data when not reconstructing a packet");
                }
                else {
                    packet = this.reconstructor.takeBinaryData(obj);
                    if (packet) {
                        // received final buffer
                        this.reconstructor = null;
                        super.emitReserved("decoded", packet);
                    }
                }
            }
            else {
                throw new Error("Unknown type: " + obj);
            }
        }
        /**
         * Decode a packet String (JSON data)
         *
         * @param {String} str
         * @return {Object} packet
         */
        decodeString(str) {
            let i = 0;
            // look up type
            const p = {
                type: Number(str.charAt(0)),
            };
            if (PacketType[p.type] === undefined) {
                throw new Error("unknown packet type " + p.type);
            }
            // look up attachments if type binary
            if (p.type === PacketType.BINARY_EVENT ||
                p.type === PacketType.BINARY_ACK) {
                const start = i + 1;
                while (str.charAt(++i) !== "-" && i != str.length) { }
                const buf = str.substring(start, i);
                if (buf != Number(buf) || str.charAt(i) !== "-") {
                    throw new Error("Illegal attachments");
                }
                p.attachments = Number(buf);
            }
            // look up namespace (if any)
            if ("/" === str.charAt(i + 1)) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if ("," === c)
                        break;
                    if (i === str.length)
                        break;
                }
                p.nsp = str.substring(start, i);
            }
            else {
                p.nsp = "/";
            }
            // look up id
            const next = str.charAt(i + 1);
            if ("" !== next && Number(next) == next) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if (null == c || Number(c) != c) {
                        --i;
                        break;
                    }
                    if (i === str.length)
                        break;
                }
                p.id = Number(str.substring(start, i + 1));
            }
            // look up json data
            if (str.charAt(++i)) {
                const payload = this.tryParse(str.substr(i));
                if (Decoder.isPayloadValid(p.type, payload)) {
                    p.data = payload;
                }
                else {
                    throw new Error("invalid payload");
                }
            }
            return p;
        }
        tryParse(str) {
            try {
                return JSON.parse(str, this.reviver);
            }
            catch (e) {
                return false;
            }
        }
        static isPayloadValid(type, payload) {
            switch (type) {
                case PacketType.CONNECT:
                    return typeof payload === "object";
                case PacketType.DISCONNECT:
                    return payload === undefined;
                case PacketType.CONNECT_ERROR:
                    return typeof payload === "string" || typeof payload === "object";
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    return Array.isArray(payload) && payload.length > 0;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    return Array.isArray(payload);
            }
        }
        /**
         * Deallocates a parser's resources
         */
        destroy() {
            if (this.reconstructor) {
                this.reconstructor.finishedReconstruction();
                this.reconstructor = null;
            }
        }
    }
    /**
     * A manager of a binary event's 'buffer sequence'. Should
     * be constructed whenever a packet of type BINARY_EVENT is
     * decoded.
     *
     * @param {Object} packet
     * @return {BinaryReconstructor} initialized reconstructor
     */
    class BinaryReconstructor {
        constructor(packet) {
            this.packet = packet;
            this.buffers = [];
            this.reconPack = packet;
        }
        /**
         * Method to be called when binary data received from connection
         * after a BINARY_EVENT packet.
         *
         * @param {Buffer | ArrayBuffer} binData - the raw binary data received
         * @return {null | Object} returns null if more binary data is expected or
         *   a reconstructed packet object if all buffers have been received.
         */
        takeBinaryData(binData) {
            this.buffers.push(binData);
            if (this.buffers.length === this.reconPack.attachments) {
                // done with buffer list
                const packet = reconstructPacket(this.reconPack, this.buffers);
                this.finishedReconstruction();
                return packet;
            }
            return null;
        }
        /**
         * Cleans up binary packet reconstruction variables.
         */
        finishedReconstruction() {
            this.reconPack = null;
            this.buffers = [];
        }
    }

    var parser = /*#__PURE__*/Object.freeze({
        __proto__: null,
        protocol: protocol,
        get PacketType () { return PacketType; },
        Encoder: Encoder,
        Decoder: Decoder
    });

    function on(obj, ev, fn) {
        obj.on(ev, fn);
        return function subDestroy() {
            obj.off(ev, fn);
        };
    }

    /**
     * Internal events.
     * These events can't be emitted by the user.
     */
    const RESERVED_EVENTS = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
        newListener: 1,
        removeListener: 1,
    });
    /**
     * A Socket is the fundamental class for interacting with the server.
     *
     * A Socket belongs to a certain Namespace (by default /) and uses an underlying {@link Manager} to communicate.
     *
     * @example
     * const socket = io();
     *
     * socket.on("connect", () => {
     *   console.log("connected");
     * });
     *
     * // send an event to the server
     * socket.emit("foo", "bar");
     *
     * socket.on("foobar", () => {
     *   // an event was received from the server
     * });
     *
     * // upon disconnection
     * socket.on("disconnect", (reason) => {
     *   console.log(`disconnected due to ${reason}`);
     * });
     */
    class Socket extends Emitter {
        /**
         * `Socket` constructor.
         */
        constructor(io, nsp, opts) {
            super();
            /**
             * Whether the socket is currently connected to the server.
             *
             * @example
             * const socket = io();
             *
             * socket.on("connect", () => {
             *   console.log(socket.connected); // true
             * });
             *
             * socket.on("disconnect", () => {
             *   console.log(socket.connected); // false
             * });
             */
            this.connected = false;
            /**
             * Whether the connection state was recovered after a temporary disconnection. In that case, any missed packets will
             * be transmitted by the server.
             */
            this.recovered = false;
            /**
             * Buffer for packets received before the CONNECT packet
             */
            this.receiveBuffer = [];
            /**
             * Buffer for packets that will be sent once the socket is connected
             */
            this.sendBuffer = [];
            /**
             * The queue of packets to be sent with retry in case of failure.
             *
             * Packets are sent one by one, each waiting for the server acknowledgement, in order to guarantee the delivery order.
             * @private
             */
            this._queue = [];
            /**
             * A sequence to generate the ID of the {@link QueuedPacket}.
             * @private
             */
            this._queueSeq = 0;
            this.ids = 0;
            this.acks = {};
            this.flags = {};
            this.io = io;
            this.nsp = nsp;
            if (opts && opts.auth) {
                this.auth = opts.auth;
            }
            this._opts = Object.assign({}, opts);
            if (this.io._autoConnect)
                this.open();
        }
        /**
         * Whether the socket is currently disconnected
         *
         * @example
         * const socket = io();
         *
         * socket.on("connect", () => {
         *   console.log(socket.disconnected); // false
         * });
         *
         * socket.on("disconnect", () => {
         *   console.log(socket.disconnected); // true
         * });
         */
        get disconnected() {
            return !this.connected;
        }
        /**
         * Subscribe to open, close and packet events
         *
         * @private
         */
        subEvents() {
            if (this.subs)
                return;
            const io = this.io;
            this.subs = [
                on(io, "open", this.onopen.bind(this)),
                on(io, "packet", this.onpacket.bind(this)),
                on(io, "error", this.onerror.bind(this)),
                on(io, "close", this.onclose.bind(this)),
            ];
        }
        /**
         * Whether the Socket will try to reconnect when its Manager connects or reconnects.
         *
         * @example
         * const socket = io();
         *
         * console.log(socket.active); // true
         *
         * socket.on("disconnect", (reason) => {
         *   if (reason === "io server disconnect") {
         *     // the disconnection was initiated by the server, you need to manually reconnect
         *     console.log(socket.active); // false
         *   }
         *   // else the socket will automatically try to reconnect
         *   console.log(socket.active); // true
         * });
         */
        get active() {
            return !!this.subs;
        }
        /**
         * "Opens" the socket.
         *
         * @example
         * const socket = io({
         *   autoConnect: false
         * });
         *
         * socket.connect();
         */
        connect() {
            if (this.connected)
                return this;
            this.subEvents();
            if (!this.io["_reconnecting"])
                this.io.open(); // ensure open
            if ("open" === this.io._readyState)
                this.onopen();
            return this;
        }
        /**
         * Alias for {@link connect()}.
         */
        open() {
            return this.connect();
        }
        /**
         * Sends a `message` event.
         *
         * This method mimics the WebSocket.send() method.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
         *
         * @example
         * socket.send("hello");
         *
         * // this is equivalent to
         * socket.emit("message", "hello");
         *
         * @return self
         */
        send(...args) {
            args.unshift("message");
            this.emit.apply(this, args);
            return this;
        }
        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @example
         * socket.emit("hello", "world");
         *
         * // all serializable datastructures are supported (no need to call JSON.stringify)
         * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
         *
         * // with an acknowledgement from the server
         * socket.emit("hello", "world", (val) => {
         *   // ...
         * });
         *
         * @return self
         */
        emit(ev, ...args) {
            if (RESERVED_EVENTS.hasOwnProperty(ev)) {
                throw new Error('"' + ev.toString() + '" is a reserved event name');
            }
            args.unshift(ev);
            if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
                this._addToQueue(args);
                return this;
            }
            const packet = {
                type: PacketType.EVENT,
                data: args,
            };
            packet.options = {};
            packet.options.compress = this.flags.compress !== false;
            // event ack callback
            if ("function" === typeof args[args.length - 1]) {
                const id = this.ids++;
                const ack = args.pop();
                this._registerAckCallback(id, ack);
                packet.id = id;
            }
            const isTransportWritable = this.io.engine &&
                this.io.engine.transport &&
                this.io.engine.transport.writable;
            const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
            if (discardPacket) ;
            else if (this.connected) {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            }
            else {
                this.sendBuffer.push(packet);
            }
            this.flags = {};
            return this;
        }
        /**
         * @private
         */
        _registerAckCallback(id, ack) {
            var _a;
            const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
            if (timeout === undefined) {
                this.acks[id] = ack;
                return;
            }
            // @ts-ignore
            const timer = this.io.setTimeoutFn(() => {
                delete this.acks[id];
                for (let i = 0; i < this.sendBuffer.length; i++) {
                    if (this.sendBuffer[i].id === id) {
                        this.sendBuffer.splice(i, 1);
                    }
                }
                ack.call(this, new Error("operation has timed out"));
            }, timeout);
            this.acks[id] = (...args) => {
                // @ts-ignore
                this.io.clearTimeoutFn(timer);
                ack.apply(this, [null, ...args]);
            };
        }
        /**
         * Emits an event and waits for an acknowledgement
         *
         * @example
         * // without timeout
         * const response = await socket.emitWithAck("hello", "world");
         *
         * // with a specific timeout
         * try {
         *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
         * } catch (err) {
         *   // the server did not acknowledge the event in the given delay
         * }
         *
         * @return a Promise that will be fulfilled when the server acknowledges the event
         */
        emitWithAck(ev, ...args) {
            // the timeout flag is optional
            const withErr = this.flags.timeout !== undefined || this._opts.ackTimeout !== undefined;
            return new Promise((resolve, reject) => {
                args.push((arg1, arg2) => {
                    if (withErr) {
                        return arg1 ? reject(arg1) : resolve(arg2);
                    }
                    else {
                        return resolve(arg1);
                    }
                });
                this.emit(ev, ...args);
            });
        }
        /**
         * Add the packet to the queue.
         * @param args
         * @private
         */
        _addToQueue(args) {
            let ack;
            if (typeof args[args.length - 1] === "function") {
                ack = args.pop();
            }
            const packet = {
                id: this._queueSeq++,
                tryCount: 0,
                pending: false,
                args,
                flags: Object.assign({ fromQueue: true }, this.flags),
            };
            args.push((err, ...responseArgs) => {
                if (packet !== this._queue[0]) {
                    // the packet has already been acknowledged
                    return;
                }
                const hasError = err !== null;
                if (hasError) {
                    if (packet.tryCount > this._opts.retries) {
                        this._queue.shift();
                        if (ack) {
                            ack(err);
                        }
                    }
                }
                else {
                    this._queue.shift();
                    if (ack) {
                        ack(null, ...responseArgs);
                    }
                }
                packet.pending = false;
                return this._drainQueue();
            });
            this._queue.push(packet);
            this._drainQueue();
        }
        /**
         * Send the first packet of the queue, and wait for an acknowledgement from the server.
         * @param force - whether to resend a packet that has not been acknowledged yet
         *
         * @private
         */
        _drainQueue(force = false) {
            if (!this.connected || this._queue.length === 0) {
                return;
            }
            const packet = this._queue[0];
            if (packet.pending && !force) {
                return;
            }
            packet.pending = true;
            packet.tryCount++;
            this.flags = packet.flags;
            this.emit.apply(this, packet.args);
        }
        /**
         * Sends a packet.
         *
         * @param packet
         * @private
         */
        packet(packet) {
            packet.nsp = this.nsp;
            this.io._packet(packet);
        }
        /**
         * Called upon engine `open`.
         *
         * @private
         */
        onopen() {
            if (typeof this.auth == "function") {
                this.auth((data) => {
                    this._sendConnectPacket(data);
                });
            }
            else {
                this._sendConnectPacket(this.auth);
            }
        }
        /**
         * Sends a CONNECT packet to initiate the Socket.IO session.
         *
         * @param data
         * @private
         */
        _sendConnectPacket(data) {
            this.packet({
                type: PacketType.CONNECT,
                data: this._pid
                    ? Object.assign({ pid: this._pid, offset: this._lastOffset }, data)
                    : data,
            });
        }
        /**
         * Called upon engine or manager `error`.
         *
         * @param err
         * @private
         */
        onerror(err) {
            if (!this.connected) {
                this.emitReserved("connect_error", err);
            }
        }
        /**
         * Called upon engine `close`.
         *
         * @param reason
         * @param description
         * @private
         */
        onclose(reason, description) {
            this.connected = false;
            delete this.id;
            this.emitReserved("disconnect", reason, description);
        }
        /**
         * Called with socket packet.
         *
         * @param packet
         * @private
         */
        onpacket(packet) {
            const sameNamespace = packet.nsp === this.nsp;
            if (!sameNamespace)
                return;
            switch (packet.type) {
                case PacketType.CONNECT:
                    if (packet.data && packet.data.sid) {
                        this.onconnect(packet.data.sid, packet.data.pid);
                    }
                    else {
                        this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                    }
                    break;
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    this.onevent(packet);
                    break;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    this.onack(packet);
                    break;
                case PacketType.DISCONNECT:
                    this.ondisconnect();
                    break;
                case PacketType.CONNECT_ERROR:
                    this.destroy();
                    const err = new Error(packet.data.message);
                    // @ts-ignore
                    err.data = packet.data.data;
                    this.emitReserved("connect_error", err);
                    break;
            }
        }
        /**
         * Called upon a server event.
         *
         * @param packet
         * @private
         */
        onevent(packet) {
            const args = packet.data || [];
            if (null != packet.id) {
                args.push(this.ack(packet.id));
            }
            if (this.connected) {
                this.emitEvent(args);
            }
            else {
                this.receiveBuffer.push(Object.freeze(args));
            }
        }
        emitEvent(args) {
            if (this._anyListeners && this._anyListeners.length) {
                const listeners = this._anyListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, args);
                }
            }
            super.emit.apply(this, args);
            if (this._pid && args.length && typeof args[args.length - 1] === "string") {
                this._lastOffset = args[args.length - 1];
            }
        }
        /**
         * Produces an ack callback to emit with an event.
         *
         * @private
         */
        ack(id) {
            const self = this;
            let sent = false;
            return function (...args) {
                // prevent double callbacks
                if (sent)
                    return;
                sent = true;
                self.packet({
                    type: PacketType.ACK,
                    id: id,
                    data: args,
                });
            };
        }
        /**
         * Called upon a server acknowlegement.
         *
         * @param packet
         * @private
         */
        onack(packet) {
            const ack = this.acks[packet.id];
            if ("function" === typeof ack) {
                ack.apply(this, packet.data);
                delete this.acks[packet.id];
            }
        }
        /**
         * Called upon server connect.
         *
         * @private
         */
        onconnect(id, pid) {
            this.id = id;
            this.recovered = pid && this._pid === pid;
            this._pid = pid; // defined only if connection state recovery is enabled
            this.connected = true;
            this.emitBuffered();
            this.emitReserved("connect");
            this._drainQueue(true);
        }
        /**
         * Emit buffered events (received and emitted).
         *
         * @private
         */
        emitBuffered() {
            this.receiveBuffer.forEach((args) => this.emitEvent(args));
            this.receiveBuffer = [];
            this.sendBuffer.forEach((packet) => {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            });
            this.sendBuffer = [];
        }
        /**
         * Called upon server disconnect.
         *
         * @private
         */
        ondisconnect() {
            this.destroy();
            this.onclose("io server disconnect");
        }
        /**
         * Called upon forced client/server side disconnections,
         * this method ensures the manager stops tracking us and
         * that reconnections don't get triggered for this.
         *
         * @private
         */
        destroy() {
            if (this.subs) {
                // clean subscriptions to avoid reconnections
                this.subs.forEach((subDestroy) => subDestroy());
                this.subs = undefined;
            }
            this.io["_destroy"](this);
        }
        /**
         * Disconnects the socket manually. In that case, the socket will not try to reconnect.
         *
         * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
         *
         * @example
         * const socket = io();
         *
         * socket.on("disconnect", (reason) => {
         *   // console.log(reason); prints "io client disconnect"
         * });
         *
         * socket.disconnect();
         *
         * @return self
         */
        disconnect() {
            if (this.connected) {
                this.packet({ type: PacketType.DISCONNECT });
            }
            // remove socket from pool
            this.destroy();
            if (this.connected) {
                // fire events
                this.onclose("io client disconnect");
            }
            return this;
        }
        /**
         * Alias for {@link disconnect()}.
         *
         * @return self
         */
        close() {
            return this.disconnect();
        }
        /**
         * Sets the compress flag.
         *
         * @example
         * socket.compress(false).emit("hello");
         *
         * @param compress - if `true`, compresses the sending data
         * @return self
         */
        compress(compress) {
            this.flags.compress = compress;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
         * ready to send messages.
         *
         * @example
         * socket.volatile.emit("hello"); // the server may or may not receive it
         *
         * @returns self
         */
        get volatile() {
            this.flags.volatile = true;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
         * given number of milliseconds have elapsed without an acknowledgement from the server:
         *
         * @example
         * socket.timeout(5000).emit("my-event", (err) => {
         *   if (err) {
         *     // the server did not acknowledge the event in the given delay
         *   }
         * });
         *
         * @returns self
         */
        timeout(timeout) {
            this.flags.timeout = timeout;
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @example
         * socket.onAny((event, ...args) => {
         *   console.log(`got ${event}`);
         * });
         *
         * @param listener
         */
        onAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @example
         * socket.prependAny((event, ...args) => {
         *   console.log(`got event ${event}`);
         * });
         *
         * @param listener
         */
        prependAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`got event ${event}`);
         * }
         *
         * socket.onAny(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAny(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAny();
         *
         * @param listener
         */
        offAny(listener) {
            if (!this._anyListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAny() {
            return this._anyListeners || [];
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.onAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        onAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.prependAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        prependAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`sent event ${event}`);
         * }
         *
         * socket.onAnyOutgoing(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAnyOutgoing(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAnyOutgoing();
         *
         * @param [listener] - the catch-all listener (optional)
         */
        offAnyOutgoing(listener) {
            if (!this._anyOutgoingListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyOutgoingListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyOutgoingListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAnyOutgoing() {
            return this._anyOutgoingListeners || [];
        }
        /**
         * Notify the listeners for each packet sent
         *
         * @param packet
         *
         * @private
         */
        notifyOutgoingListeners(packet) {
            if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
                const listeners = this._anyOutgoingListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, packet.data);
                }
            }
        }
    }

    /**
     * Initialize backoff timer with `opts`.
     *
     * - `min` initial timeout in milliseconds [100]
     * - `max` max timeout [10000]
     * - `jitter` [0]
     * - `factor` [2]
     *
     * @param {Object} opts
     * @api public
     */
    function Backoff(opts) {
        opts = opts || {};
        this.ms = opts.min || 100;
        this.max = opts.max || 10000;
        this.factor = opts.factor || 2;
        this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
        this.attempts = 0;
    }
    /**
     * Return the backoff duration.
     *
     * @return {Number}
     * @api public
     */
    Backoff.prototype.duration = function () {
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
            var rand = Math.random();
            var deviation = Math.floor(rand * this.jitter * ms);
            ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
    };
    /**
     * Reset the number of attempts.
     *
     * @api public
     */
    Backoff.prototype.reset = function () {
        this.attempts = 0;
    };
    /**
     * Set the minimum duration
     *
     * @api public
     */
    Backoff.prototype.setMin = function (min) {
        this.ms = min;
    };
    /**
     * Set the maximum duration
     *
     * @api public
     */
    Backoff.prototype.setMax = function (max) {
        this.max = max;
    };
    /**
     * Set the jitter
     *
     * @api public
     */
    Backoff.prototype.setJitter = function (jitter) {
        this.jitter = jitter;
    };

    class Manager extends Emitter {
        constructor(uri, opts) {
            var _a;
            super();
            this.nsps = {};
            this.subs = [];
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = undefined;
            }
            opts = opts || {};
            opts.path = opts.path || "/socket.io";
            this.opts = opts;
            installTimerFunctions(this, opts);
            this.reconnection(opts.reconnection !== false);
            this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
            this.reconnectionDelay(opts.reconnectionDelay || 1000);
            this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
            this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
            this.backoff = new Backoff({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor(),
            });
            this.timeout(null == opts.timeout ? 20000 : opts.timeout);
            this._readyState = "closed";
            this.uri = uri;
            const _parser = opts.parser || parser;
            this.encoder = new _parser.Encoder();
            this.decoder = new _parser.Decoder();
            this._autoConnect = opts.autoConnect !== false;
            if (this._autoConnect)
                this.open();
        }
        reconnection(v) {
            if (!arguments.length)
                return this._reconnection;
            this._reconnection = !!v;
            return this;
        }
        reconnectionAttempts(v) {
            if (v === undefined)
                return this._reconnectionAttempts;
            this._reconnectionAttempts = v;
            return this;
        }
        reconnectionDelay(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelay;
            this._reconnectionDelay = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
            return this;
        }
        randomizationFactor(v) {
            var _a;
            if (v === undefined)
                return this._randomizationFactor;
            this._randomizationFactor = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
            return this;
        }
        reconnectionDelayMax(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelayMax;
            this._reconnectionDelayMax = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
            return this;
        }
        timeout(v) {
            if (!arguments.length)
                return this._timeout;
            this._timeout = v;
            return this;
        }
        /**
         * Starts trying to reconnect if reconnection is enabled and we have not
         * started reconnecting yet
         *
         * @private
         */
        maybeReconnectOnOpen() {
            // Only try to reconnect if it's the first time we're connecting
            if (!this._reconnecting &&
                this._reconnection &&
                this.backoff.attempts === 0) {
                // keeps reconnection from firing twice for the same reconnection loop
                this.reconnect();
            }
        }
        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} fn - optional, callback
         * @return self
         * @public
         */
        open(fn) {
            if (~this._readyState.indexOf("open"))
                return this;
            this.engine = new Socket$1(this.uri, this.opts);
            const socket = this.engine;
            const self = this;
            this._readyState = "opening";
            this.skipReconnect = false;
            // emit `open`
            const openSubDestroy = on(socket, "open", function () {
                self.onopen();
                fn && fn();
            });
            // emit `error`
            const errorSub = on(socket, "error", (err) => {
                self.cleanup();
                self._readyState = "closed";
                this.emitReserved("error", err);
                if (fn) {
                    fn(err);
                }
                else {
                    // Only do this if there is no fn to handle the error
                    self.maybeReconnectOnOpen();
                }
            });
            if (false !== this._timeout) {
                const timeout = this._timeout;
                if (timeout === 0) {
                    openSubDestroy(); // prevents a race condition with the 'open' event
                }
                // set timer
                const timer = this.setTimeoutFn(() => {
                    openSubDestroy();
                    socket.close();
                    // @ts-ignore
                    socket.emit("error", new Error("timeout"));
                }, timeout);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
            this.subs.push(openSubDestroy);
            this.subs.push(errorSub);
            return this;
        }
        /**
         * Alias for open()
         *
         * @return self
         * @public
         */
        connect(fn) {
            return this.open(fn);
        }
        /**
         * Called upon transport open.
         *
         * @private
         */
        onopen() {
            // clear old subs
            this.cleanup();
            // mark as open
            this._readyState = "open";
            this.emitReserved("open");
            // add new subs
            const socket = this.engine;
            this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
        }
        /**
         * Called upon a ping.
         *
         * @private
         */
        onping() {
            this.emitReserved("ping");
        }
        /**
         * Called with data.
         *
         * @private
         */
        ondata(data) {
            try {
                this.decoder.add(data);
            }
            catch (e) {
                this.onclose("parse error", e);
            }
        }
        /**
         * Called when parser fully decodes a packet.
         *
         * @private
         */
        ondecoded(packet) {
            // the nextTick call prevents an exception in a user-provided event listener from triggering a disconnection due to a "parse error"
            nextTick(() => {
                this.emitReserved("packet", packet);
            }, this.setTimeoutFn);
        }
        /**
         * Called upon socket error.
         *
         * @private
         */
        onerror(err) {
            this.emitReserved("error", err);
        }
        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         * @public
         */
        socket(nsp, opts) {
            let socket = this.nsps[nsp];
            if (!socket) {
                socket = new Socket(this, nsp, opts);
                this.nsps[nsp] = socket;
            }
            else if (this._autoConnect && !socket.active) {
                socket.connect();
            }
            return socket;
        }
        /**
         * Called upon a socket close.
         *
         * @param socket
         * @private
         */
        _destroy(socket) {
            const nsps = Object.keys(this.nsps);
            for (const nsp of nsps) {
                const socket = this.nsps[nsp];
                if (socket.active) {
                    return;
                }
            }
            this._close();
        }
        /**
         * Writes a packet.
         *
         * @param packet
         * @private
         */
        _packet(packet) {
            const encodedPackets = this.encoder.encode(packet);
            for (let i = 0; i < encodedPackets.length; i++) {
                this.engine.write(encodedPackets[i], packet.options);
            }
        }
        /**
         * Clean up transport subscriptions and packet buffer.
         *
         * @private
         */
        cleanup() {
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs.length = 0;
            this.decoder.destroy();
        }
        /**
         * Close the current socket.
         *
         * @private
         */
        _close() {
            this.skipReconnect = true;
            this._reconnecting = false;
            this.onclose("forced close");
            if (this.engine)
                this.engine.close();
        }
        /**
         * Alias for close()
         *
         * @private
         */
        disconnect() {
            return this._close();
        }
        /**
         * Called upon engine close.
         *
         * @private
         */
        onclose(reason, description) {
            this.cleanup();
            this.backoff.reset();
            this._readyState = "closed";
            this.emitReserved("close", reason, description);
            if (this._reconnection && !this.skipReconnect) {
                this.reconnect();
            }
        }
        /**
         * Attempt a reconnection.
         *
         * @private
         */
        reconnect() {
            if (this._reconnecting || this.skipReconnect)
                return this;
            const self = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) {
                this.backoff.reset();
                this.emitReserved("reconnect_failed");
                this._reconnecting = false;
            }
            else {
                const delay = this.backoff.duration();
                this._reconnecting = true;
                const timer = this.setTimeoutFn(() => {
                    if (self.skipReconnect)
                        return;
                    this.emitReserved("reconnect_attempt", self.backoff.attempts);
                    // check again for the case socket closed in above events
                    if (self.skipReconnect)
                        return;
                    self.open((err) => {
                        if (err) {
                            self._reconnecting = false;
                            self.reconnect();
                            this.emitReserved("reconnect_error", err);
                        }
                        else {
                            self.onreconnect();
                        }
                    });
                }, delay);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
        }
        /**
         * Called upon successful reconnect.
         *
         * @private
         */
        onreconnect() {
            const attempt = this.backoff.attempts;
            this._reconnecting = false;
            this.backoff.reset();
            this.emitReserved("reconnect", attempt);
        }
    }

    /**
     * Managers cache.
     */
    const cache = {};
    function lookup(uri, opts) {
        if (typeof uri === "object") {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        const parsed = url(uri, opts.path || "/socket.io");
        const source = parsed.source;
        const id = parsed.id;
        const path = parsed.path;
        const sameNamespace = cache[id] && path in cache[id]["nsps"];
        const newConnection = opts.forceNew ||
            opts["force new connection"] ||
            false === opts.multiplex ||
            sameNamespace;
        let io;
        if (newConnection) {
            io = new Manager(source, opts);
        }
        else {
            if (!cache[id]) {
                cache[id] = new Manager(source, opts);
            }
            io = cache[id];
        }
        if (parsed.query && !opts.query) {
            opts.query = parsed.queryKey;
        }
        return io.socket(parsed.path, opts);
    }
    // so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
    // namespace (e.g. `io.connect(...)`), for backward compatibility
    Object.assign(lookup, {
        Manager,
        Socket,
        io: lookup,
        connect: lookup,
    });

    const socket = lookup(undefined); // Initiate the socket connection to the API

    /* node_modules\svelte-icons\fa\FaCloudUploadAlt.svelte generated by Svelte v3.58.0 */
    const file$5 = "node_modules\\svelte-icons\\fa\\FaCloudUploadAlt.svelte";

    // (4:8) <IconBase viewBox="0 0 640 512" {...$$props}>
    function create_default_slot$2(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zM393.4 288H328v112c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V288h-65.4c-14.3 0-21.4-17.2-11.3-27.3l105.4-105.4c6.2-6.2 16.4-6.2 22.6 0l105.4 105.4c10.1 10.1 2.9 27.3-11.3 27.3z");
    			add_location(path, file$5, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 640 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 640 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
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
    	validate_slots('FaCloudUploadAlt', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaCloudUploadAlt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaCloudUploadAlt",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\File.svelte generated by Svelte v3.58.0 */
    const file$4 = "src\\components\\File.svelte";

    function create_fragment$5(ctx) {
    	let div3;
    	let div0;
    	let p0;
    	let t0;
    	let t1;
    	let p1;
    	let t3;
    	let div2;
    	let p2;
    	let t5;
    	let div1;
    	let p3;
    	let t6;

    	let t7_value = (/*name*/ ctx[1].length > 30
    	? `${/*name*/ ctx[1].substring(0, 30)}...`
    	: /*name*/ ctx[1]) + "";

    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text(/*username*/ ctx[0]);
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = `${/*received*/ ctx[2]}`;
    			t3 = space();
    			div2 = element("div");
    			p2 = element("p");
    			p2.textContent = "I've shared an encrypted file with you.";
    			t5 = space();
    			div1 = element("div");
    			p3 = element("p");
    			t6 = text("Download ");
    			t7 = text(t7_value);
    			attr_dev(p0, "class", "username svelte-1e1qydl");
    			add_location(p0, file$4, 32, 8, 938);
    			attr_dev(p1, "class", "timestamp svelte-1e1qydl");
    			add_location(p1, file$4, 35, 8, 1006);
    			set_style(div0, "display", "flex");
    			set_style(div0, "align-items", "center");
    			add_location(div0, file$4, 31, 4, 879);
    			attr_dev(p2, "class", "content svelte-1e1qydl");
    			add_location(p2, file$4, 38, 8, 1074);
    			set_style(p3, "margin", "0");
    			set_style(p3, "padding", "0");
    			add_location(p3, file$4, 40, 12, 1209);
    			attr_dev(div1, "class", "downloadButton svelte-1e1qydl");
    			add_location(div1, file$4, 39, 8, 1146);
    			add_location(div2, file$4, 37, 4, 1059);
    			attr_dev(div3, "class", "container svelte-1e1qydl");
    			add_location(div3, file$4, 30, 0, 850);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, p2);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, p3);
    			append_dev(p3, t6);
    			append_dev(p3, t7);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*doDecrypt*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*username*/ 1) set_data_dev(t0, /*username*/ ctx[0]);

    			if (dirty & /*name*/ 2 && t7_value !== (t7_value = (/*name*/ ctx[1].length > 30
    			? `${/*name*/ ctx[1].substring(0, 30)}...`
    			: /*name*/ ctx[1]) + "")) set_data_dev(t7, t7_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			dispose();
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
    	validate_slots('File', slots, []);
    	let { username } = $$props;
    	let { id } = $$props;
    	let { iv } = $$props;
    	let { name } = $$props;
    	let { type } = $$props;
    	let { key } = $$props;
    	const received = new Date().toLocaleTimeString();
    	const dlUrl = `${undefined}/efile/${id}`;

    	const doDecrypt = async () => {
    		const res = await fetch(dlUrl);

    		if (res.status !== 200) {
    			alert("Unable to download and decrypt file.");
    			return;
    		}

    		// get arraybuffer
    		const arrayBuffer = await res.arrayBuffer();

    		// decrypt
    		const decrypted = await decryptData({ iv, data: arrayBuffer }, key);

    		const blob = new Blob([decrypted], { type });
    		const url = URL.createObjectURL(blob);
    		const a = document.createElement("a");
    		a.href = url;
    		a.download = name;
    		a.click();
    	};

    	$$self.$$.on_mount.push(function () {
    		if (username === undefined && !('username' in $$props || $$self.$$.bound[$$self.$$.props['username']])) {
    			console.warn("<File> was created without expected prop 'username'");
    		}

    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<File> was created without expected prop 'id'");
    		}

    		if (iv === undefined && !('iv' in $$props || $$self.$$.bound[$$self.$$.props['iv']])) {
    			console.warn("<File> was created without expected prop 'iv'");
    		}

    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<File> was created without expected prop 'name'");
    		}

    		if (type === undefined && !('type' in $$props || $$self.$$.bound[$$self.$$.props['type']])) {
    			console.warn("<File> was created without expected prop 'type'");
    		}

    		if (key === undefined && !('key' in $$props || $$self.$$.bound[$$self.$$.props['key']])) {
    			console.warn("<File> was created without expected prop 'key'");
    		}
    	});

    	const writable_props = ['username', 'id', 'iv', 'name', 'type', 'key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<File> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('id' in $$props) $$invalidate(4, id = $$props.id);
    		if ('iv' in $$props) $$invalidate(5, iv = $$props.iv);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('type' in $$props) $$invalidate(6, type = $$props.type);
    		if ('key' in $$props) $$invalidate(7, key = $$props.key);
    	};

    	$$self.$capture_state = () => ({
    		decryptData,
    		username,
    		id,
    		iv,
    		name,
    		type,
    		key,
    		received,
    		dlUrl,
    		doDecrypt
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('id' in $$props) $$invalidate(4, id = $$props.id);
    		if ('iv' in $$props) $$invalidate(5, iv = $$props.iv);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('type' in $$props) $$invalidate(6, type = $$props.type);
    		if ('key' in $$props) $$invalidate(7, key = $$props.key);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [username, name, received, doDecrypt, id, iv, type, key];
    }

    class File$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			username: 0,
    			id: 4,
    			iv: 5,
    			name: 1,
    			type: 6,
    			key: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "File",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get username() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set username(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iv() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iv(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-icons\fa\FaPaperPlane.svelte generated by Svelte v3.58.0 */
    const file$3 = "node_modules\\svelte-icons\\fa\\FaPaperPlane.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$1(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z");
    			add_location(path, file$3, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaPaperPlane', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaPaperPlane extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaPaperPlane",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const calculateRgba = (color, opacity) => {
        if (color[0] === "#") {
            color = color.slice(1);
        }
        if (color.length === 3) {
            let res = "";
            color.split("").forEach((c) => {
                res += c;
                res += c;
            });
            color = res;
        }
        const rgbValues = (color.match(/.{2}/g) || [])
            .map((hex) => parseInt(hex, 16))
            .join(", ");
        return `rgba(${rgbValues}, ${opacity})`;
    };
    const range = (size, startAt = 0) => [...Array(size).keys()].map(i => i + startAt);
    // export const characterRange = (startChar, endChar) =>
    //   String.fromCharCode(
    //     ...range(
    //       endChar.charCodeAt(0) - startChar.charCodeAt(0),
    //       startChar.charCodeAt(0)
    //     )
    //   );
    // export const zip = (arr, ...arrs) =>
    //   arr.map((val, i) => arrs.reduce((list, curr) => [...list, curr[i]], [val]));

    /* node_modules\svelte-loading-spinners\dist\BarLoader.svelte generated by Svelte v3.58.0 */
    const file$2 = "node_modules\\svelte-loading-spinners\\dist\\BarLoader.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (74:2) {#each range(2, 1) as version}
    function create_each_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "lines small-lines " + /*version*/ ctx[5] + " svelte-vhcw6");
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$2, 74, 4, 1591);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(74:2) {#each range(2, 1) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let each_value = range(2, 1);
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

    			attr_dev(div, "class", "wrapper svelte-vhcw6");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--rgba", /*rgba*/ ctx[4]);
    			add_location(div, file$2, 72, 0, 1486);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*range, color, duration*/ 5) {
    				each_value = range(2, 1);
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

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*rgba*/ 16) {
    				set_style(div, "--rgba", /*rgba*/ ctx[4]);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BarLoader', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "2.1s" } = $$props;
    	let { size = "60" } = $$props;
    	let rgba;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BarLoader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		calculateRgba,
    		range,
    		color,
    		unit,
    		duration,
    		size,
    		rgba
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('rgba' in $$props) $$invalidate(4, rgba = $$props.rgba);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*color*/ 1) {
    			$$invalidate(4, rgba = calculateRgba(color, 0.2));
    		}
    	};

    	return [color, unit, duration, size, rgba];
    }

    class BarLoader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BarLoader",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get color() {
    		throw new Error("<BarLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<BarLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<BarLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<BarLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<BarLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<BarLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<BarLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<BarLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\UploadingAlert.svelte generated by Svelte v3.58.0 */
    const file$1 = "src\\components\\UploadingAlert.svelte";

    function create_fragment$2(ctx) {
    	let div4;
    	let div3;
    	let div1;
    	let div0;
    	let fapaperplane;
    	let t0;
    	let h1;
    	let t2;
    	let p;
    	let t3;
    	let b;
    	let t4;
    	let t5;
    	let t6;
    	let div2;
    	let barloader;
    	let current;
    	fapaperplane = new FaPaperPlane({ $$inline: true });

    	barloader = new BarLoader({
    			props: { color: "#4B4B4B" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fapaperplane.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Uploading file...";
    			t2 = space();
    			p = element("p");
    			t3 = text("Please standby while ");
    			b = element("b");
    			t4 = text(/*fileName*/ ctx[0]);
    			t5 = text(" is being end-to-end encrypted\r\n            and uploaded to the server.");
    			t6 = space();
    			div2 = element("div");
    			create_component(barloader.$$.fragment);
    			attr_dev(div0, "class", "icon svelte-1gu4n7k");
    			add_location(div0, file$1, 10, 12, 340);
    			attr_dev(div1, "class", "parent svelte-1gu4n7k");
    			add_location(div1, file$1, 9, 8, 306);
    			add_location(h1, file$1, 14, 8, 438);
    			add_location(b, file$1, 16, 33, 512);
    			add_location(p, file$1, 15, 8, 474);
    			attr_dev(div2, "class", "parent svelte-1gu4n7k");
    			add_location(div2, file$1, 19, 8, 624);
    			attr_dev(div3, "class", "dialog__content");
    			add_location(div3, file$1, 8, 4, 267);
    			attr_dev(div4, "class", "dialog__modal");
    			add_location(div4, file$1, 6, 0, 206);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			mount_component(fapaperplane, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, h1);
    			append_dev(div3, t2);
    			append_dev(div3, p);
    			append_dev(p, t3);
    			append_dev(p, b);
    			append_dev(b, t4);
    			append_dev(p, t5);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			mount_component(barloader, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*fileName*/ 1) set_data_dev(t4, /*fileName*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fapaperplane.$$.fragment, local);
    			transition_in(barloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fapaperplane.$$.fragment, local);
    			transition_out(barloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(fapaperplane);
    			destroy_component(barloader);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UploadingAlert', slots, []);
    	let { fileName = "your file" } = $$props;
    	const writable_props = ['fileName'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UploadingAlert> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('fileName' in $$props) $$invalidate(0, fileName = $$props.fileName);
    	};

    	$$self.$capture_state = () => ({ fileName, FaPaperPlane, BarLoader });

    	$$self.$inject_state = $$props => {
    		if ('fileName' in $$props) $$invalidate(0, fileName = $$props.fileName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fileName];
    }

    class UploadingAlert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { fileName: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UploadingAlert",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get fileName() {
    		throw new Error("<UploadingAlert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileName(value) {
    		throw new Error("<UploadingAlert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Chat.svelte generated by Svelte v3.58.0 */

    const { console: console_1 } = globals;
    const file = "src\\routes\\Chat.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (273:0) {#if showUploadingDialog}
    function create_if_block_2(ctx) {
    	let uploadingalert;
    	let current;

    	uploadingalert = new UploadingAlert({
    			props: { fileName: /*currentFileName*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(uploadingalert.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(uploadingalert, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const uploadingalert_changes = {};
    			if (dirty & /*currentFileName*/ 16) uploadingalert_changes.fileName = /*currentFileName*/ ctx[4];
    			uploadingalert.$set(uploadingalert_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(uploadingalert.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(uploadingalert.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(uploadingalert, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(273:0) {#if showUploadingDialog}",
    		ctx
    	});

    	return block;
    }

    // (298:46) 
    function create_if_block_1(ctx) {
    	let filemessage;
    	let current;
    	const filemessage_spread_levels = [/*message*/ ctx[6].data];
    	let filemessage_props = {};

    	for (let i = 0; i < filemessage_spread_levels.length; i += 1) {
    		filemessage_props = assign(filemessage_props, filemessage_spread_levels[i]);
    	}

    	filemessage = new File$1({ props: filemessage_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(filemessage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filemessage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filemessage_changes = (dirty & /*messages*/ 1)
    			? get_spread_update(filemessage_spread_levels, [get_spread_object(/*message*/ ctx[6].data)])
    			: {};

    			filemessage.$set(filemessage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filemessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filemessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filemessage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(298:46) ",
    		ctx
    	});

    	return block;
    }

    // (290:12) {#if message.type === "message"}
    function create_if_block(ctx) {
    	let message_1;
    	let current;

    	const message_1_spread_levels = [
    		{ keys: /*keys*/ ctx[1] },
    		/*message*/ ctx[6].data,
    		{
    			group: /*message*/ ctx[6].data.uid && /*message*/ ctx[6].data.uid === /*messages*/ ctx[0][/*index*/ ctx[27] - 1].data.uid
    		}
    	];

    	let message_1_props = {};

    	for (let i = 0; i < message_1_spread_levels.length; i += 1) {
    		message_1_props = assign(message_1_props, message_1_spread_levels[i]);
    	}

    	message_1 = new Message({ props: message_1_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(message_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(message_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const message_1_changes = (dirty & /*keys, messages*/ 3)
    			? get_spread_update(message_1_spread_levels, [
    					dirty & /*keys*/ 2 && { keys: /*keys*/ ctx[1] },
    					dirty & /*messages*/ 1 && get_spread_object(/*message*/ ctx[6].data),
    					dirty & /*messages*/ 1 && {
    						group: /*message*/ ctx[6].data.uid && /*message*/ ctx[6].data.uid === /*messages*/ ctx[0][/*index*/ ctx[27] - 1].data.uid
    					}
    				])
    			: {};

    			message_1.$set(message_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(message_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(message_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(message_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(290:12) {#if message.type === \\\"message\\\"}",
    		ctx
    	});

    	return block;
    }

    // (289:8) {#each messages as message, index}
    function create_each_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*message*/ ctx[6].type === "message") return 0;
    		if (/*message*/ ctx[6].type === "file") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
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
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(289:8) {#each messages as message, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let div8;
    	let div1;
    	let div0;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let div2;
    	let h1;
    	let t6;
    	let h2;
    	let t8;
    	let div3;
    	let t9;
    	let div6;
    	let input0;
    	let t10;
    	let div4;
    	let faclouduploadalt;
    	let t11;
    	let div5;
    	let faarrowaltcircleup;
    	let t12;
    	let div7;
    	let button0;
    	let t14;
    	let button1;
    	let t16;
    	let input1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*showUploadingDialog*/ ctx[5] && create_if_block_2(ctx);
    	let each_value = /*messages*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	faclouduploadalt = new FaCloudUploadAlt({ $$inline: true });
    	faarrowaltcircleup = new FaArrowAltCircleUp({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Room Key:";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = `${/*roomKey*/ ctx[7]}`;
    			t4 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "CryptoChat";
    			t6 = space();
    			h2 = element("h2");
    			h2.textContent = "A stunning encrypted chat app.";
    			t8 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			div6 = element("div");
    			input0 = element("input");
    			t10 = space();
    			div4 = element("div");
    			create_component(faclouduploadalt.$$.fragment);
    			t11 = space();
    			div5 = element("div");
    			create_component(faarrowaltcircleup.$$.fragment);
    			t12 = space();
    			div7 = element("div");
    			button0 = element("button");
    			button0.textContent = "Theme";
    			t14 = space();
    			button1 = element("button");
    			button1.textContent = "Leave";
    			t16 = space();
    			input1 = element("input");
    			add_location(p0, file, 279, 12, 9764);
    			attr_dev(p1, "class", "roomKey svelte-1jw23mg");
    			add_location(p1, file, 280, 12, 9794);
    			attr_dev(div0, "class", "keyInfo svelte-1jw23mg");
    			add_location(div0, file, 278, 8, 9729);
    			attr_dev(div1, "class", "infoBar svelte-1jw23mg");
    			add_location(div1, file, 277, 4, 9698);
    			set_style(h1, "margin", "0");
    			set_style(h1, "font-size", "3rem");
    			add_location(h1, file, 284, 8, 9890);
    			set_style(h2, "margin", "0");
    			add_location(h2, file, 285, 8, 9955);
    			attr_dev(div2, "class", "titles svelte-1jw23mg");
    			add_location(div2, file, 283, 4, 9860);
    			attr_dev(div3, "class", "chatBox svelte-1jw23mg");
    			add_location(div3, file, 287, 4, 10031);
    			set_style(input0, "color", "var(--text-color)");
    			attr_dev(input0, "class", "messageInput override svelte-1jw23mg");
    			attr_dev(input0, "placeholder", "What's up?");
    			add_location(input0, file, 303, 8, 10650);
    			attr_dev(div4, "class", "inputIcon icon svelte-1jw23mg");
    			add_location(div4, file, 310, 8, 10880);
    			attr_dev(div5, "class", "inputIcon icon svelte-1jw23mg");
    			add_location(div5, file, 313, 8, 10999);
    			attr_dev(div6, "class", "messageBox svelte-1jw23mg");
    			add_location(div6, file, 302, 4, 10616);
    			add_location(button0, file, 318, 8, 11146);
    			add_location(button1, file, 319, 8, 11201);
    			attr_dev(div7, "class", "buttons svelte-1jw23mg");
    			add_location(div7, file, 317, 4, 11115);
    			attr_dev(div8, "class", "container svelte-1jw23mg");
    			add_location(div8, file, 276, 0, 9669);
    			attr_dev(input1, "type", "file");
    			set_style(input1, "display", "none");
    			add_location(input1, file, 323, 0, 11266);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t2);
    			append_dev(div0, p1);
    			append_dev(div8, t4);
    			append_dev(div8, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t6);
    			append_dev(div2, h2);
    			append_dev(div8, t8);
    			append_dev(div8, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div3, null);
    				}
    			}

    			/*div3_binding*/ ctx[12](div3);
    			append_dev(div8, t9);
    			append_dev(div8, div6);
    			append_dev(div6, input0);
    			set_input_value(input0, /*message*/ ctx[6]);
    			append_dev(div6, t10);
    			append_dev(div6, div4);
    			mount_component(faclouduploadalt, div4, null);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			mount_component(faarrowaltcircleup, div5, null);
    			append_dev(div8, t12);
    			append_dev(div8, div7);
    			append_dev(div7, button0);
    			append_dev(div7, t14);
    			append_dev(div7, button1);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, input1, anchor);
    			/*input1_binding*/ ctx[15](input1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "keydown", /*handleKeyDown*/ ctx[9], false, false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(div4, "click", /*click_handler*/ ctx[14], false, false, false, false),
    					listen_dev(div5, "click", /*doSend*/ ctx[8], false, false, false, false),
    					listen_dev(button0, "click", switchTheme, false, false, false, false),
    					listen_dev(button1, "click", /*doLeave*/ ctx[10], false, false, false, false),
    					listen_dev(input1, "change", /*doFileUpload*/ ctx[11], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showUploadingDialog*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showUploadingDialog*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*keys, messages*/ 3) {
    				each_value = /*messages*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div3, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*message*/ 64 && input0.value !== /*message*/ ctx[6]) {
    				set_input_value(input0, /*message*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(faclouduploadalt.$$.fragment, local);
    			transition_in(faarrowaltcircleup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(faclouduploadalt.$$.fragment, local);
    			transition_out(faarrowaltcircleup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div8);
    			destroy_each(each_blocks, detaching);
    			/*div3_binding*/ ctx[12](null);
    			destroy_component(faclouduploadalt);
    			destroy_component(faarrowaltcircleup);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(input1);
    			/*input1_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('Chat', slots, []);
    	const username = window.localStorage.getItem("username");
    	const roomKey = window.localStorage.getItem("roomKey");
    	let message = "";
    	let messages = [];

    	// hash the roomKey with SHA-512
    	let hashedRoomKey;

    	let rawHashedRoomKey;
    	rawHashedRoomKey = SHA512.hash(roomKey);

    	for (let i = 0; i < 500; i++) {
    		rawHashedRoomKey = SHA512.hash(rawHashedRoomKey);
    	}

    	hashedRoomKey = rawHashedRoomKey.toString();
    	const enc = new TextEncoder();
    	const dec = new TextDecoder();

    	const doSend = async () => {
    		if (!username || !roomKey || !message) {
    			return;
    		}

    		// process commands
    		switch (message) {
    			case "/debug":
    				console.log("username:", username);
    				console.log("roomKey:", roomKey);
    				console.log("hashedRoomKey:", hashedRoomKey);
    				$$invalidate(0, messages = [
    					...messages,
    					{
    						type: "message",
    						data: {
    							isSystem: true,
    							username: { iv: "", data: "System" },
    							content: {
    								iv: "",
    								data: `Username: ${username}\n\nRoom Key: ${roomKey}\n\nHashed Room Key: ${hashedRoomKey}`
    							},
    							requiresDecryption: false
    						}
    					}
    				]);
    				$$invalidate(6, message = "");
    				return;
    			case "/clear":
    				$$invalidate(0, messages = []);
    				$$invalidate(6, message = "");
    				return;
    			case "/theme":
    				switchTheme();
    				$$invalidate(6, message = "");
    				return;
    			case "/quit":
    			case "/exit":
    			case "/leave":
    				window.location.href = "/";
    				return;
    		}

    		// create random aes 256 gcm key and send it with the message encrypted
    		const messageKeypair = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);

    		// export the key as raw
    		const messageKeyRaw = await window.crypto.subtle.exportKey("raw", messageKeypair);

    		const encryptedMessageKey = await encrypt(messageKeyRaw, keys);

    		// encrypt username
    		const encryptedUsername = await encrypt(enc.encode(username), messageKeypair);

    		// encrypt message
    		const encryptedMessage = await encrypt(enc.encode(message), messageKeypair);

    		socket.emit("chat event", {
    			roomName: hashedRoomKey,
    			username: encryptedUsername,
    			message: encryptedMessage,
    			key: encryptedMessageKey
    		});

    		$$invalidate(6, message = "");
    	};

    	const handleKeyDown = async e => {
    		if (e.key == "Enter") {
    			await doSend();
    		}
    	};

    	let keys;

    	onMount(async () => {
    		if (!username || !roomKey) {
    			return;
    		}

    		// derive keypair
    		$$invalidate(1, keys = await deriveKeypair(roomKey, hashedRoomKey));

    		// encrypt username
    		const encryptedUsername = await encrypt(enc.encode(username), keys);

    		// send join
    		socket.emit("join", {
    			roomName: hashedRoomKey,
    			username: encryptedUsername
    		}); // Emit the join event

    		socket.on("chat response", messageHandler);
    		socket.on("join response", joinHandler);
    		socket.on("leave response", leaveHandler);
    		socket.on("file response", fileHandler);

    		// socket.on('user count', userCountHandler);
    		// do something every 10s
    		setInterval(
    			() => {
    				doKeepAlive();
    			},
    			10000
    		);
    	});

    	onDestroy(() => {
    		socket.off("chat response");
    		socket.off("file response");
    		socket.off("join response");
    		socket.off("leave response");
    	}); // socket.off('user count');

    	const leaveHandler = async msg => {
    		// parse message
    		const { id, username } = msg;

    		const usernameJson = JSON.parse(username);

    		// decrypt username
    		const decryptedUsername = dec.decode(await decrypt(usernameJson, keys));

    		// add message
    		$$invalidate(0, messages = [
    			...messages,
    			{
    				type: "message",
    				data: {
    					isSystem: true,
    					username: { iv: "", data: "System" },
    					content: {
    						iv: "",
    						data: `${decryptedUsername} (${id}) has left the chat.`
    					},
    					requiresDecryption: false
    				}
    			}
    		]);
    	};

    	const joinHandler = async msg => {
    		// decrypt username
    		const decryptedUsername = await decrypt(msg.username, keys);

    		$$invalidate(0, messages = [
    			...messages,
    			{
    				type: "message",
    				data: {
    					isSystem: true,
    					username: { iv: "", data: "System" },
    					content: {
    						iv: "",
    						data: `${dec.decode(decryptedUsername)} (${msg.id}) has joined the room.`
    					},
    					requiresDecryption: false
    				}
    			}
    		]);
    	};

    	let messageRef;

    	const messageHandler = async msg => {
    		const parsedData = {
    			username: msg.username,
    			content: msg.message,
    			isSystem: false,
    			requiresDecryption: true,
    			key: await window.crypto.subtle.importKey("raw", await decrypt(msg.key, keys), { name: "AES-GCM", length: 256 }, false, ["decrypt"]),
    			uid: msg.uid
    		};

    		$$invalidate(0, messages = [...messages, { type: "message", data: parsedData }]);

    		// wait 5 ms because the DOM is not ready yet
    		await new Promise(resolve => setTimeout(resolve, 5));

    		$$invalidate(2, messageRef.scrollTop = messageRef.scrollHeight + messageRef.clientHeight, messageRef);
    	};

    	const doLeave = async () => {
    		window.localStorage.clear();

    		// go to landing page
    		window.location.href = "/";
    	};

    	const doKeepAlive = async () => {
    		socket.emit("keepalive", { roomName: hashedRoomKey });
    	};

    	document.documentElement.setAttribute("data-theme", window.localStorage.getItem("theme"));
    	let input;

    	const doFileUpload = async e => {
    		// get file from input
    		const file = e.target.files[0];

    		$$invalidate(4, currentFileName = file.name);
    		$$invalidate(5, showUploadingDialog = true);

    		// get file data
    		let reader = new FileReader();

    		reader.readAsArrayBuffer(file);

    		reader.onload = async () => {
    			const fileData = reader.result;
    			const fileKey = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);

    			// export the key as raw
    			const fileKeyRaw = await window.crypto.subtle.exportKey("raw", fileKey);

    			const encryptedFileKey = await encrypt(fileKeyRaw, keys);

    			// encrypt file data
    			const encryptedFileData = await encryptData(fileData, fileKey);

    			const formData = new FormData();
    			formData.append("efile", new Blob([encryptedFileData.data]));
    			const request = await fetch(`${undefined}/upload`, { method: "POST", body: formData });

    			if (request.status === 200) {
    				const response = await request.json();
    				const encryptedUsername = await encrypt(enc.encode(username), keys);
    				const encryptedName = await encrypt(enc.encode(file.name), keys);
    				const encryptedType = await encrypt(enc.encode(file.type), keys);

    				socket.emit("file event", {
    					roomName: hashedRoomKey,
    					username: encryptedUsername,
    					id: response.uuid,
    					iv: encryptedFileData.iv,
    					name: encryptedName,
    					type: encryptedType,
    					key: encryptedFileKey
    				});
    			} else {
    				alert("Unable to upload file.");
    			}

    			$$invalidate(5, showUploadingDialog = false);
    		};
    	};

    	const fileHandler = async msg => {
    		// decrypt username
    		const decryptedUsername = dec.decode(await decrypt(msg.username, keys));

    		const decryptedName = dec.decode(await decrypt({ iv: msg.name.iv, data: msg.name.data }, keys));
    		const decryptedType = dec.decode(await decrypt({ iv: msg.type.iv, data: msg.type.data }, keys));

    		// decrypt key
    		const decryptedKey = await decrypt({ iv: msg.key.iv, data: msg.key.data }, keys);

    		$$invalidate(0, messages = [
    			...messages,
    			{
    				type: "file",
    				data: {
    					username: decryptedUsername,
    					id: msg.id,
    					iv: msg.iv,
    					name: decryptedName,
    					type: decryptedType,
    					key: await window.crypto.subtle.importKey("raw", decryptedKey, { name: "AES-GCM", length: 256 }, true, ["decrypt"]),
    					uid: msg.id
    				}
    			}
    		]);
    	};

    	let currentFileName = "";
    	let showUploadingDialog = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Chat> was created with unknown prop '${key}'`);
    	});

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			messageRef = $$value;
    			$$invalidate(2, messageRef);
    		});
    	}

    	function input0_input_handler() {
    		message = this.value;
    		$$invalidate(6, message);
    	}

    	const click_handler = () => input.click();

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(3, input);
    		});
    	}

    	$$self.$capture_state = () => ({
    		SHA512,
    		Message,
    		FaArrowAltCircleUp,
    		decrypt,
    		deriveKeypair,
    		encrypt,
    		onDestroy,
    		onMount,
    		socket,
    		switchTheme,
    		FaCloudUploadAlt,
    		encryptData,
    		FileMessage: File$1,
    		UploadingAlert,
    		username,
    		roomKey,
    		message,
    		messages,
    		hashedRoomKey,
    		rawHashedRoomKey,
    		enc,
    		dec,
    		doSend,
    		handleKeyDown,
    		keys,
    		leaveHandler,
    		joinHandler,
    		messageRef,
    		messageHandler,
    		doLeave,
    		doKeepAlive,
    		input,
    		doFileUpload,
    		fileHandler,
    		currentFileName,
    		showUploadingDialog
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(6, message = $$props.message);
    		if ('messages' in $$props) $$invalidate(0, messages = $$props.messages);
    		if ('hashedRoomKey' in $$props) hashedRoomKey = $$props.hashedRoomKey;
    		if ('rawHashedRoomKey' in $$props) rawHashedRoomKey = $$props.rawHashedRoomKey;
    		if ('keys' in $$props) $$invalidate(1, keys = $$props.keys);
    		if ('messageRef' in $$props) $$invalidate(2, messageRef = $$props.messageRef);
    		if ('input' in $$props) $$invalidate(3, input = $$props.input);
    		if ('currentFileName' in $$props) $$invalidate(4, currentFileName = $$props.currentFileName);
    		if ('showUploadingDialog' in $$props) $$invalidate(5, showUploadingDialog = $$props.showUploadingDialog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		messages,
    		keys,
    		messageRef,
    		input,
    		currentFileName,
    		showUploadingDialog,
    		message,
    		roomKey,
    		doSend,
    		handleKeyDown,
    		doLeave,
    		doFileUpload,
    		div3_binding,
    		input0_input_handler,
    		click_handler,
    		input1_binding
    	];
    }

    class Chat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chat",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /*
     * Dexie.js - a minimalistic wrapper for IndexedDB
     * ===============================================
     *
     * By David Fahlander, david.fahlander@gmail.com
     *
     * Version 3.2.3, Mon Jan 23 2023
     *
     * https://dexie.org
     *
     * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
     */
     
    const _global = typeof globalThis !== 'undefined' ? globalThis :
        typeof self !== 'undefined' ? self :
            typeof window !== 'undefined' ? window :
                global;

    const keys = Object.keys;
    const isArray = Array.isArray;
    if (typeof Promise !== 'undefined' && !_global.Promise) {
        _global.Promise = Promise;
    }
    function extend(obj, extension) {
        if (typeof extension !== 'object')
            return obj;
        keys(extension).forEach(function (key) {
            obj[key] = extension[key];
        });
        return obj;
    }
    const getProto = Object.getPrototypeOf;
    const _hasOwn = {}.hasOwnProperty;
    function hasOwn(obj, prop) {
        return _hasOwn.call(obj, prop);
    }
    function props(proto, extension) {
        if (typeof extension === 'function')
            extension = extension(getProto(proto));
        (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(key => {
            setProp(proto, key, extension[key]);
        });
    }
    const defineProperty = Object.defineProperty;
    function setProp(obj, prop, functionOrGetSet, options) {
        defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === 'function' ?
            { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } :
            { value: functionOrGetSet, configurable: true, writable: true }, options));
    }
    function derive(Child) {
        return {
            from: function (Parent) {
                Child.prototype = Object.create(Parent.prototype);
                setProp(Child.prototype, "constructor", Child);
                return {
                    extend: props.bind(null, Child.prototype)
                };
            }
        };
    }
    const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    function getPropertyDescriptor(obj, prop) {
        const pd = getOwnPropertyDescriptor(obj, prop);
        let proto;
        return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
    }
    const _slice = [].slice;
    function slice(args, start, end) {
        return _slice.call(args, start, end);
    }
    function override(origFunc, overridedFactory) {
        return overridedFactory(origFunc);
    }
    function assert(b) {
        if (!b)
            throw new Error("Assertion Failed");
    }
    function asap$1(fn) {
        if (_global.setImmediate)
            setImmediate(fn);
        else
            setTimeout(fn, 0);
    }
    function arrayToObject(array, extractor) {
        return array.reduce((result, item, i) => {
            var nameAndValue = extractor(item, i);
            if (nameAndValue)
                result[nameAndValue[0]] = nameAndValue[1];
            return result;
        }, {});
    }
    function tryCatch(fn, onerror, args) {
        try {
            fn.apply(null, args);
        }
        catch (ex) {
            onerror && onerror(ex);
        }
    }
    function getByKeyPath(obj, keyPath) {
        if (hasOwn(obj, keyPath))
            return obj[keyPath];
        if (!keyPath)
            return obj;
        if (typeof keyPath !== 'string') {
            var rv = [];
            for (var i = 0, l = keyPath.length; i < l; ++i) {
                var val = getByKeyPath(obj, keyPath[i]);
                rv.push(val);
            }
            return rv;
        }
        var period = keyPath.indexOf('.');
        if (period !== -1) {
            var innerObj = obj[keyPath.substr(0, period)];
            return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
        }
        return undefined;
    }
    function setByKeyPath(obj, keyPath, value) {
        if (!obj || keyPath === undefined)
            return;
        if ('isFrozen' in Object && Object.isFrozen(obj))
            return;
        if (typeof keyPath !== 'string' && 'length' in keyPath) {
            assert(typeof value !== 'string' && 'length' in value);
            for (var i = 0, l = keyPath.length; i < l; ++i) {
                setByKeyPath(obj, keyPath[i], value[i]);
            }
        }
        else {
            var period = keyPath.indexOf('.');
            if (period !== -1) {
                var currentKeyPath = keyPath.substr(0, period);
                var remainingKeyPath = keyPath.substr(period + 1);
                if (remainingKeyPath === "")
                    if (value === undefined) {
                        if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
                            obj.splice(currentKeyPath, 1);
                        else
                            delete obj[currentKeyPath];
                    }
                    else
                        obj[currentKeyPath] = value;
                else {
                    var innerObj = obj[currentKeyPath];
                    if (!innerObj || !hasOwn(obj, currentKeyPath))
                        innerObj = (obj[currentKeyPath] = {});
                    setByKeyPath(innerObj, remainingKeyPath, value);
                }
            }
            else {
                if (value === undefined) {
                    if (isArray(obj) && !isNaN(parseInt(keyPath)))
                        obj.splice(keyPath, 1);
                    else
                        delete obj[keyPath];
                }
                else
                    obj[keyPath] = value;
            }
        }
    }
    function delByKeyPath(obj, keyPath) {
        if (typeof keyPath === 'string')
            setByKeyPath(obj, keyPath, undefined);
        else if ('length' in keyPath)
            [].map.call(keyPath, function (kp) {
                setByKeyPath(obj, kp, undefined);
            });
    }
    function shallowClone(obj) {
        var rv = {};
        for (var m in obj) {
            if (hasOwn(obj, m))
                rv[m] = obj[m];
        }
        return rv;
    }
    const concat = [].concat;
    function flatten(a) {
        return concat.apply([], a);
    }
    const intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey"
        .split(',').concat(flatten([8, 16, 32, 64].map(num => ["Int", "Uint", "Float"].map(t => t + num + "Array")))).filter(t => _global[t]);
    const intrinsicTypes = intrinsicTypeNames.map(t => _global[t]);
    arrayToObject(intrinsicTypeNames, x => [x, true]);
    let circularRefs = null;
    function deepClone(any) {
        circularRefs = typeof WeakMap !== 'undefined' && new WeakMap();
        const rv = innerDeepClone(any);
        circularRefs = null;
        return rv;
    }
    function innerDeepClone(any) {
        if (!any || typeof any !== 'object')
            return any;
        let rv = circularRefs && circularRefs.get(any);
        if (rv)
            return rv;
        if (isArray(any)) {
            rv = [];
            circularRefs && circularRefs.set(any, rv);
            for (var i = 0, l = any.length; i < l; ++i) {
                rv.push(innerDeepClone(any[i]));
            }
        }
        else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
            rv = any;
        }
        else {
            const proto = getProto(any);
            rv = proto === Object.prototype ? {} : Object.create(proto);
            circularRefs && circularRefs.set(any, rv);
            for (var prop in any) {
                if (hasOwn(any, prop)) {
                    rv[prop] = innerDeepClone(any[prop]);
                }
            }
        }
        return rv;
    }
    const { toString } = {};
    function toStringTag(o) {
        return toString.call(o).slice(8, -1);
    }
    const iteratorSymbol = typeof Symbol !== 'undefined' ?
        Symbol.iterator :
        '@@iterator';
    const getIteratorOf = typeof iteratorSymbol === "symbol" ? function (x) {
        var i;
        return x != null && (i = x[iteratorSymbol]) && i.apply(x);
    } : function () { return null; };
    const NO_CHAR_ARRAY = {};
    function getArrayOf(arrayLike) {
        var i, a, x, it;
        if (arguments.length === 1) {
            if (isArray(arrayLike))
                return arrayLike.slice();
            if (this === NO_CHAR_ARRAY && typeof arrayLike === 'string')
                return [arrayLike];
            if ((it = getIteratorOf(arrayLike))) {
                a = [];
                while ((x = it.next()), !x.done)
                    a.push(x.value);
                return a;
            }
            if (arrayLike == null)
                return [arrayLike];
            i = arrayLike.length;
            if (typeof i === 'number') {
                a = new Array(i);
                while (i--)
                    a[i] = arrayLike[i];
                return a;
            }
            return [arrayLike];
        }
        i = arguments.length;
        a = new Array(i);
        while (i--)
            a[i] = arguments[i];
        return a;
    }
    const isAsyncFunction = typeof Symbol !== 'undefined'
        ? (fn) => fn[Symbol.toStringTag] === 'AsyncFunction'
        : () => false;

    var debug = typeof location !== 'undefined' &&
        /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
    function setDebug(value, filter) {
        debug = value;
        libraryFilter = filter;
    }
    var libraryFilter = () => true;
    const NEEDS_THROW_FOR_STACK = !new Error("").stack;
    function getErrorWithStack() {
        if (NEEDS_THROW_FOR_STACK)
            try {
                getErrorWithStack.arguments;
                throw new Error();
            }
            catch (e) {
                return e;
            }
        return new Error();
    }
    function prettyStack(exception, numIgnoredFrames) {
        var stack = exception.stack;
        if (!stack)
            return "";
        numIgnoredFrames = (numIgnoredFrames || 0);
        if (stack.indexOf(exception.name) === 0)
            numIgnoredFrames += (exception.name + exception.message).split('\n').length;
        return stack.split('\n')
            .slice(numIgnoredFrames)
            .filter(libraryFilter)
            .map(frame => "\n" + frame)
            .join('');
    }

    var dexieErrorNames = [
        'Modify',
        'Bulk',
        'OpenFailed',
        'VersionChange',
        'Schema',
        'Upgrade',
        'InvalidTable',
        'MissingAPI',
        'NoSuchDatabase',
        'InvalidArgument',
        'SubTransaction',
        'Unsupported',
        'Internal',
        'DatabaseClosed',
        'PrematureCommit',
        'ForeignAwait'
    ];
    var idbDomErrorNames = [
        'Unknown',
        'Constraint',
        'Data',
        'TransactionInactive',
        'ReadOnly',
        'Version',
        'NotFound',
        'InvalidState',
        'InvalidAccess',
        'Abort',
        'Timeout',
        'QuotaExceeded',
        'Syntax',
        'DataClone'
    ];
    var errorList = dexieErrorNames.concat(idbDomErrorNames);
    var defaultTexts = {
        VersionChanged: "Database version changed by other database connection",
        DatabaseClosed: "Database has been closed",
        Abort: "Transaction aborted",
        TransactionInactive: "Transaction has already completed or failed",
        MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
    };
    function DexieError(name, msg) {
        this._e = getErrorWithStack();
        this.name = name;
        this.message = msg;
    }
    derive(DexieError).from(Error).extend({
        stack: {
            get: function () {
                return this._stack ||
                    (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
            }
        },
        toString: function () { return this.name + ": " + this.message; }
    });
    function getMultiErrorMessage(msg, failures) {
        return msg + ". Errors: " + Object.keys(failures)
            .map(key => failures[key].toString())
            .filter((v, i, s) => s.indexOf(v) === i)
            .join('\n');
    }
    function ModifyError(msg, failures, successCount, failedKeys) {
        this._e = getErrorWithStack();
        this.failures = failures;
        this.failedKeys = failedKeys;
        this.successCount = successCount;
        this.message = getMultiErrorMessage(msg, failures);
    }
    derive(ModifyError).from(DexieError);
    function BulkError(msg, failures) {
        this._e = getErrorWithStack();
        this.name = "BulkError";
        this.failures = Object.keys(failures).map(pos => failures[pos]);
        this.failuresByPos = failures;
        this.message = getMultiErrorMessage(msg, failures);
    }
    derive(BulkError).from(DexieError);
    var errnames = errorList.reduce((obj, name) => (obj[name] = name + "Error", obj), {});
    const BaseException = DexieError;
    var exceptions = errorList.reduce((obj, name) => {
        var fullName = name + "Error";
        function DexieError(msgOrInner, inner) {
            this._e = getErrorWithStack();
            this.name = fullName;
            if (!msgOrInner) {
                this.message = defaultTexts[name] || fullName;
                this.inner = null;
            }
            else if (typeof msgOrInner === 'string') {
                this.message = `${msgOrInner}${!inner ? '' : '\n ' + inner}`;
                this.inner = inner || null;
            }
            else if (typeof msgOrInner === 'object') {
                this.message = `${msgOrInner.name} ${msgOrInner.message}`;
                this.inner = msgOrInner;
            }
        }
        derive(DexieError).from(BaseException);
        obj[name] = DexieError;
        return obj;
    }, {});
    exceptions.Syntax = SyntaxError;
    exceptions.Type = TypeError;
    exceptions.Range = RangeError;
    var exceptionMap = idbDomErrorNames.reduce((obj, name) => {
        obj[name + "Error"] = exceptions[name];
        return obj;
    }, {});
    function mapError(domError, message) {
        if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
            return domError;
        var rv = new exceptionMap[domError.name](message || domError.message, domError);
        if ("stack" in domError) {
            setProp(rv, "stack", { get: function () {
                    return this.inner.stack;
                } });
        }
        return rv;
    }
    var fullNameExceptions = errorList.reduce((obj, name) => {
        if (["Syntax", "Type", "Range"].indexOf(name) === -1)
            obj[name + "Error"] = exceptions[name];
        return obj;
    }, {});
    fullNameExceptions.ModifyError = ModifyError;
    fullNameExceptions.DexieError = DexieError;
    fullNameExceptions.BulkError = BulkError;

    function nop() { }
    function mirror(val) { return val; }
    function pureFunctionChain(f1, f2) {
        if (f1 == null || f1 === mirror)
            return f2;
        return function (val) {
            return f2(f1(val));
        };
    }
    function callBoth(on1, on2) {
        return function () {
            on1.apply(this, arguments);
            on2.apply(this, arguments);
        };
    }
    function hookCreatingChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            var res = f1.apply(this, arguments);
            if (res !== undefined)
                arguments[0] = res;
            var onsuccess = this.onsuccess,
            onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
                this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
                this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res2 !== undefined ? res2 : res;
        };
    }
    function hookDeletingChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            f1.apply(this, arguments);
            var onsuccess = this.onsuccess,
            onerror = this.onerror;
            this.onsuccess = this.onerror = null;
            f2.apply(this, arguments);
            if (onsuccess)
                this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
                this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        };
    }
    function hookUpdatingChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function (modifications) {
            var res = f1.apply(this, arguments);
            extend(modifications, res);
            var onsuccess = this.onsuccess,
            onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
                this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
                this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res === undefined ?
                (res2 === undefined ? undefined : res2) :
                (extend(res, res2));
        };
    }
    function reverseStoppableEventChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            if (f2.apply(this, arguments) === false)
                return false;
            return f1.apply(this, arguments);
        };
    }
    function promisableChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            var res = f1.apply(this, arguments);
            if (res && typeof res.then === 'function') {
                var thiz = this, i = arguments.length, args = new Array(i);
                while (i--)
                    args[i] = arguments[i];
                return res.then(function () {
                    return f2.apply(thiz, args);
                });
            }
            return f2.apply(this, arguments);
        };
    }

    var INTERNAL = {};
    const LONG_STACKS_CLIP_LIMIT = 100,
    MAX_LONG_STACKS = 20, ZONE_ECHO_LIMIT = 100, [resolvedNativePromise, nativePromiseProto, resolvedGlobalPromise] = typeof Promise === 'undefined' ?
        [] :
        (() => {
            let globalP = Promise.resolve();
            if (typeof crypto === 'undefined' || !crypto.subtle)
                return [globalP, getProto(globalP), globalP];
            const nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
            return [
                nativeP,
                getProto(nativeP),
                globalP
            ];
        })(), nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
    const NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
    const patchGlobalPromise = !!resolvedGlobalPromise;
    var stack_being_generated = false;
    var schedulePhysicalTick = resolvedGlobalPromise ?
        () => { resolvedGlobalPromise.then(physicalTick); }
        :
            _global.setImmediate ?
                setImmediate.bind(null, physicalTick) :
                _global.MutationObserver ?
                    () => {
                        var hiddenDiv = document.createElement("div");
                        (new MutationObserver(() => {
                            physicalTick();
                            hiddenDiv = null;
                        })).observe(hiddenDiv, { attributes: true });
                        hiddenDiv.setAttribute('i', '1');
                    } :
                    () => { setTimeout(physicalTick, 0); };
    var asap = function (callback, args) {
        microtickQueue.push([callback, args]);
        if (needsNewPhysicalTick) {
            schedulePhysicalTick();
            needsNewPhysicalTick = false;
        }
    };
    var isOutsideMicroTick = true,
    needsNewPhysicalTick = true,
    unhandledErrors = [],
    rejectingErrors = [],
    currentFulfiller = null, rejectionMapper = mirror;
    var globalPSD = {
        id: 'global',
        global: true,
        ref: 0,
        unhandleds: [],
        onunhandled: globalError,
        pgp: false,
        env: {},
        finalize: function () {
            this.unhandleds.forEach(uh => {
                try {
                    globalError(uh[0], uh[1]);
                }
                catch (e) { }
            });
        }
    };
    var PSD = globalPSD;
    var microtickQueue = [];
    var numScheduledCalls = 0;
    var tickFinalizers = [];
    function DexiePromise(fn) {
        if (typeof this !== 'object')
            throw new TypeError('Promises must be constructed via new');
        this._listeners = [];
        this.onuncatched = nop;
        this._lib = false;
        var psd = (this._PSD = PSD);
        if (debug) {
            this._stackHolder = getErrorWithStack();
            this._prev = null;
            this._numPrev = 0;
        }
        if (typeof fn !== 'function') {
            if (fn !== INTERNAL)
                throw new TypeError('Not a function');
            this._state = arguments[1];
            this._value = arguments[2];
            if (this._state === false)
                handleRejection(this, this._value);
            return;
        }
        this._state = null;
        this._value = null;
        ++psd.ref;
        executePromiseTask(this, fn);
    }
    const thenProp = {
        get: function () {
            var psd = PSD, microTaskId = totalEchoes;
            function then(onFulfilled, onRejected) {
                var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
                const cleanup = possibleAwait && !decrementExpectedAwaits();
                var rv = new DexiePromise((resolve, reject) => {
                    propagateToListener(this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
                });
                debug && linkToPreviousPromise(rv, this);
                return rv;
            }
            then.prototype = INTERNAL;
            return then;
        },
        set: function (value) {
            setProp(this, 'then', value && value.prototype === INTERNAL ?
                thenProp :
                {
                    get: function () {
                        return value;
                    },
                    set: thenProp.set
                });
        }
    };
    props(DexiePromise.prototype, {
        then: thenProp,
        _then: function (onFulfilled, onRejected) {
            propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
        },
        catch: function (onRejected) {
            if (arguments.length === 1)
                return this.then(null, onRejected);
            var type = arguments[0], handler = arguments[1];
            return typeof type === 'function' ? this.then(null, err =>
            err instanceof type ? handler(err) : PromiseReject(err))
                : this.then(null, err =>
                err && err.name === type ? handler(err) : PromiseReject(err));
        },
        finally: function (onFinally) {
            return this.then(value => {
                onFinally();
                return value;
            }, err => {
                onFinally();
                return PromiseReject(err);
            });
        },
        stack: {
            get: function () {
                if (this._stack)
                    return this._stack;
                try {
                    stack_being_generated = true;
                    var stacks = getStack(this, [], MAX_LONG_STACKS);
                    var stack = stacks.join("\nFrom previous: ");
                    if (this._state !== null)
                        this._stack = stack;
                    return stack;
                }
                finally {
                    stack_being_generated = false;
                }
            }
        },
        timeout: function (ms, msg) {
            return ms < Infinity ?
                new DexiePromise((resolve, reject) => {
                    var handle = setTimeout(() => reject(new exceptions.Timeout(msg)), ms);
                    this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
                }) : this;
        }
    });
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
        setProp(DexiePromise.prototype, Symbol.toStringTag, 'Dexie.Promise');
    globalPSD.env = snapShot();
    function Listener(onFulfilled, onRejected, resolve, reject, zone) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
        this.psd = zone;
    }
    props(DexiePromise, {
        all: function () {
            var values = getArrayOf.apply(null, arguments)
                .map(onPossibleParallellAsync);
            return new DexiePromise(function (resolve, reject) {
                if (values.length === 0)
                    resolve([]);
                var remaining = values.length;
                values.forEach((a, i) => DexiePromise.resolve(a).then(x => {
                    values[i] = x;
                    if (!--remaining)
                        resolve(values);
                }, reject));
            });
        },
        resolve: value => {
            if (value instanceof DexiePromise)
                return value;
            if (value && typeof value.then === 'function')
                return new DexiePromise((resolve, reject) => {
                    value.then(resolve, reject);
                });
            var rv = new DexiePromise(INTERNAL, true, value);
            linkToPreviousPromise(rv, currentFulfiller);
            return rv;
        },
        reject: PromiseReject,
        race: function () {
            var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise((resolve, reject) => {
                values.map(value => DexiePromise.resolve(value).then(resolve, reject));
            });
        },
        PSD: {
            get: () => PSD,
            set: value => PSD = value
        },
        totalEchoes: { get: () => totalEchoes },
        newPSD: newScope,
        usePSD: usePSD,
        scheduler: {
            get: () => asap,
            set: value => { asap = value; }
        },
        rejectionMapper: {
            get: () => rejectionMapper,
            set: value => { rejectionMapper = value; }
        },
        follow: (fn, zoneProps) => {
            return new DexiePromise((resolve, reject) => {
                return newScope((resolve, reject) => {
                    var psd = PSD;
                    psd.unhandleds = [];
                    psd.onunhandled = reject;
                    psd.finalize = callBoth(function () {
                        run_at_end_of_this_or_next_physical_tick(() => {
                            this.unhandleds.length === 0 ? resolve() : reject(this.unhandleds[0]);
                        });
                    }, psd.finalize);
                    fn();
                }, zoneProps, resolve, reject);
            });
        }
    });
    if (NativePromise) {
        if (NativePromise.allSettled)
            setProp(DexiePromise, "allSettled", function () {
                const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
                return new DexiePromise(resolve => {
                    if (possiblePromises.length === 0)
                        resolve([]);
                    let remaining = possiblePromises.length;
                    const results = new Array(remaining);
                    possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then(value => results[i] = { status: "fulfilled", value }, reason => results[i] = { status: "rejected", reason })
                        .then(() => --remaining || resolve(results)));
                });
            });
        if (NativePromise.any && typeof AggregateError !== 'undefined')
            setProp(DexiePromise, "any", function () {
                const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
                return new DexiePromise((resolve, reject) => {
                    if (possiblePromises.length === 0)
                        reject(new AggregateError([]));
                    let remaining = possiblePromises.length;
                    const failures = new Array(remaining);
                    possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then(value => resolve(value), failure => {
                        failures[i] = failure;
                        if (!--remaining)
                            reject(new AggregateError(failures));
                    }));
                });
            });
    }
    function executePromiseTask(promise, fn) {
        try {
            fn(value => {
                if (promise._state !== null)
                    return;
                if (value === promise)
                    throw new TypeError('A promise cannot be resolved with itself.');
                var shouldExecuteTick = promise._lib && beginMicroTickScope();
                if (value && typeof value.then === 'function') {
                    executePromiseTask(promise, (resolve, reject) => {
                        value instanceof DexiePromise ?
                            value._then(resolve, reject) :
                            value.then(resolve, reject);
                    });
                }
                else {
                    promise._state = true;
                    promise._value = value;
                    propagateAllListeners(promise);
                }
                if (shouldExecuteTick)
                    endMicroTickScope();
            }, handleRejection.bind(null, promise));
        }
        catch (ex) {
            handleRejection(promise, ex);
        }
    }
    function handleRejection(promise, reason) {
        rejectingErrors.push(reason);
        if (promise._state !== null)
            return;
        var shouldExecuteTick = promise._lib && beginMicroTickScope();
        reason = rejectionMapper(reason);
        promise._state = false;
        promise._value = reason;
        debug && reason !== null && typeof reason === 'object' && !reason._promise && tryCatch(() => {
            var origProp = getPropertyDescriptor(reason, "stack");
            reason._promise = promise;
            setProp(reason, "stack", {
                get: () => stack_being_generated ?
                    origProp && (origProp.get ?
                        origProp.get.apply(reason) :
                        origProp.value) :
                    promise.stack
            });
        });
        addPossiblyUnhandledError(promise);
        propagateAllListeners(promise);
        if (shouldExecuteTick)
            endMicroTickScope();
    }
    function propagateAllListeners(promise) {
        var listeners = promise._listeners;
        promise._listeners = [];
        for (var i = 0, len = listeners.length; i < len; ++i) {
            propagateToListener(promise, listeners[i]);
        }
        var psd = promise._PSD;
        --psd.ref || psd.finalize();
        if (numScheduledCalls === 0) {
            ++numScheduledCalls;
            asap(() => {
                if (--numScheduledCalls === 0)
                    finalizePhysicalTick();
            }, []);
        }
    }
    function propagateToListener(promise, listener) {
        if (promise._state === null) {
            promise._listeners.push(listener);
            return;
        }
        var cb = promise._state ? listener.onFulfilled : listener.onRejected;
        if (cb === null) {
            return (promise._state ? listener.resolve : listener.reject)(promise._value);
        }
        ++listener.psd.ref;
        ++numScheduledCalls;
        asap(callListener, [cb, promise, listener]);
    }
    function callListener(cb, promise, listener) {
        try {
            currentFulfiller = promise;
            var ret, value = promise._value;
            if (promise._state) {
                ret = cb(value);
            }
            else {
                if (rejectingErrors.length)
                    rejectingErrors = [];
                ret = cb(value);
                if (rejectingErrors.indexOf(value) === -1)
                    markErrorAsHandled(promise);
            }
            listener.resolve(ret);
        }
        catch (e) {
            listener.reject(e);
        }
        finally {
            currentFulfiller = null;
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
            --listener.psd.ref || listener.psd.finalize();
        }
    }
    function getStack(promise, stacks, limit) {
        if (stacks.length === limit)
            return stacks;
        var stack = "";
        if (promise._state === false) {
            var failure = promise._value, errorName, message;
            if (failure != null) {
                errorName = failure.name || "Error";
                message = failure.message || failure;
                stack = prettyStack(failure, 0);
            }
            else {
                errorName = failure;
                message = "";
            }
            stacks.push(errorName + (message ? ": " + message : "") + stack);
        }
        if (debug) {
            stack = prettyStack(promise._stackHolder, 2);
            if (stack && stacks.indexOf(stack) === -1)
                stacks.push(stack);
            if (promise._prev)
                getStack(promise._prev, stacks, limit);
        }
        return stacks;
    }
    function linkToPreviousPromise(promise, prev) {
        var numPrev = prev ? prev._numPrev + 1 : 0;
        if (numPrev < LONG_STACKS_CLIP_LIMIT) {
            promise._prev = prev;
            promise._numPrev = numPrev;
        }
    }
    function physicalTick() {
        beginMicroTickScope() && endMicroTickScope();
    }
    function beginMicroTickScope() {
        var wasRootExec = isOutsideMicroTick;
        isOutsideMicroTick = false;
        needsNewPhysicalTick = false;
        return wasRootExec;
    }
    function endMicroTickScope() {
        var callbacks, i, l;
        do {
            while (microtickQueue.length > 0) {
                callbacks = microtickQueue;
                microtickQueue = [];
                l = callbacks.length;
                for (i = 0; i < l; ++i) {
                    var item = callbacks[i];
                    item[0].apply(null, item[1]);
                }
            }
        } while (microtickQueue.length > 0);
        isOutsideMicroTick = true;
        needsNewPhysicalTick = true;
    }
    function finalizePhysicalTick() {
        var unhandledErrs = unhandledErrors;
        unhandledErrors = [];
        unhandledErrs.forEach(p => {
            p._PSD.onunhandled.call(null, p._value, p);
        });
        var finalizers = tickFinalizers.slice(0);
        var i = finalizers.length;
        while (i)
            finalizers[--i]();
    }
    function run_at_end_of_this_or_next_physical_tick(fn) {
        function finalizer() {
            fn();
            tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
        }
        tickFinalizers.push(finalizer);
        ++numScheduledCalls;
        asap(() => {
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
        }, []);
    }
    function addPossiblyUnhandledError(promise) {
        if (!unhandledErrors.some(p => p._value === promise._value))
            unhandledErrors.push(promise);
    }
    function markErrorAsHandled(promise) {
        var i = unhandledErrors.length;
        while (i)
            if (unhandledErrors[--i]._value === promise._value) {
                unhandledErrors.splice(i, 1);
                return;
            }
    }
    function PromiseReject(reason) {
        return new DexiePromise(INTERNAL, false, reason);
    }
    function wrap(fn, errorCatcher) {
        var psd = PSD;
        return function () {
            var wasRootExec = beginMicroTickScope(), outerScope = PSD;
            try {
                switchToZone(psd, true);
                return fn.apply(this, arguments);
            }
            catch (e) {
                errorCatcher && errorCatcher(e);
            }
            finally {
                switchToZone(outerScope, false);
                if (wasRootExec)
                    endMicroTickScope();
            }
        };
    }
    const task = { awaits: 0, echoes: 0, id: 0 };
    var taskCounter = 0;
    var zoneStack = [];
    var zoneEchoes = 0;
    var totalEchoes = 0;
    var zone_id_counter = 0;
    function newScope(fn, props, a1, a2) {
        var parent = PSD, psd = Object.create(parent);
        psd.parent = parent;
        psd.ref = 0;
        psd.global = false;
        psd.id = ++zone_id_counter;
        var globalEnv = globalPSD.env;
        psd.env = patchGlobalPromise ? {
            Promise: DexiePromise,
            PromiseProp: { value: DexiePromise, configurable: true, writable: true },
            all: DexiePromise.all,
            race: DexiePromise.race,
            allSettled: DexiePromise.allSettled,
            any: DexiePromise.any,
            resolve: DexiePromise.resolve,
            reject: DexiePromise.reject,
            nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
            gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
        } : {};
        if (props)
            extend(psd, props);
        ++parent.ref;
        psd.finalize = function () {
            --this.parent.ref || this.parent.finalize();
        };
        var rv = usePSD(psd, fn, a1, a2);
        if (psd.ref === 0)
            psd.finalize();
        return rv;
    }
    function incrementExpectedAwaits() {
        if (!task.id)
            task.id = ++taskCounter;
        ++task.awaits;
        task.echoes += ZONE_ECHO_LIMIT;
        return task.id;
    }
    function decrementExpectedAwaits() {
        if (!task.awaits)
            return false;
        if (--task.awaits === 0)
            task.id = 0;
        task.echoes = task.awaits * ZONE_ECHO_LIMIT;
        return true;
    }
    if (('' + nativePromiseThen).indexOf('[native code]') === -1) {
        incrementExpectedAwaits = decrementExpectedAwaits = nop;
    }
    function onPossibleParallellAsync(possiblePromise) {
        if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
            incrementExpectedAwaits();
            return possiblePromise.then(x => {
                decrementExpectedAwaits();
                return x;
            }, e => {
                decrementExpectedAwaits();
                return rejection(e);
            });
        }
        return possiblePromise;
    }
    function zoneEnterEcho(targetZone) {
        ++totalEchoes;
        if (!task.echoes || --task.echoes === 0) {
            task.echoes = task.id = 0;
        }
        zoneStack.push(PSD);
        switchToZone(targetZone, true);
    }
    function zoneLeaveEcho() {
        var zone = zoneStack[zoneStack.length - 1];
        zoneStack.pop();
        switchToZone(zone, false);
    }
    function switchToZone(targetZone, bEnteringZone) {
        var currentZone = PSD;
        if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
            enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
        }
        if (targetZone === PSD)
            return;
        PSD = targetZone;
        if (currentZone === globalPSD)
            globalPSD.env = snapShot();
        if (patchGlobalPromise) {
            var GlobalPromise = globalPSD.env.Promise;
            var targetEnv = targetZone.env;
            nativePromiseProto.then = targetEnv.nthen;
            GlobalPromise.prototype.then = targetEnv.gthen;
            if (currentZone.global || targetZone.global) {
                Object.defineProperty(_global, 'Promise', targetEnv.PromiseProp);
                GlobalPromise.all = targetEnv.all;
                GlobalPromise.race = targetEnv.race;
                GlobalPromise.resolve = targetEnv.resolve;
                GlobalPromise.reject = targetEnv.reject;
                if (targetEnv.allSettled)
                    GlobalPromise.allSettled = targetEnv.allSettled;
                if (targetEnv.any)
                    GlobalPromise.any = targetEnv.any;
            }
        }
    }
    function snapShot() {
        var GlobalPromise = _global.Promise;
        return patchGlobalPromise ? {
            Promise: GlobalPromise,
            PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
            all: GlobalPromise.all,
            race: GlobalPromise.race,
            allSettled: GlobalPromise.allSettled,
            any: GlobalPromise.any,
            resolve: GlobalPromise.resolve,
            reject: GlobalPromise.reject,
            nthen: nativePromiseProto.then,
            gthen: GlobalPromise.prototype.then
        } : {};
    }
    function usePSD(psd, fn, a1, a2, a3) {
        var outerScope = PSD;
        try {
            switchToZone(psd, true);
            return fn(a1, a2, a3);
        }
        finally {
            switchToZone(outerScope, false);
        }
    }
    function enqueueNativeMicroTask(job) {
        nativePromiseThen.call(resolvedNativePromise, job);
    }
    function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
        return typeof fn !== 'function' ? fn : function () {
            var outerZone = PSD;
            if (possibleAwait)
                incrementExpectedAwaits();
            switchToZone(zone, true);
            try {
                return fn.apply(this, arguments);
            }
            finally {
                switchToZone(outerZone, false);
                if (cleanup)
                    enqueueNativeMicroTask(decrementExpectedAwaits);
            }
        };
    }
    function getPatchedPromiseThen(origThen, zone) {
        return function (onResolved, onRejected) {
            return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
        };
    }
    const UNHANDLEDREJECTION = "unhandledrejection";
    function globalError(err, promise) {
        var rv;
        try {
            rv = promise.onuncatched(err);
        }
        catch (e) { }
        if (rv !== false)
            try {
                var event, eventData = { promise: promise, reason: err };
                if (_global.document && document.createEvent) {
                    event = document.createEvent('Event');
                    event.initEvent(UNHANDLEDREJECTION, true, true);
                    extend(event, eventData);
                }
                else if (_global.CustomEvent) {
                    event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
                    extend(event, eventData);
                }
                if (event && _global.dispatchEvent) {
                    dispatchEvent(event);
                    if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
                        try {
                            _global.onunhandledrejection(event);
                        }
                        catch (_) { }
                }
                if (debug && event && !event.defaultPrevented) {
                    console.warn(`Unhandled rejection: ${err.stack || err}`);
                }
            }
            catch (e) { }
    }
    var rejection = DexiePromise.reject;

    function tempTransaction(db, mode, storeNames, fn) {
        if (!db.idbdb || (!db._state.openComplete && (!PSD.letThrough && !db._vip))) {
            if (db._state.openComplete) {
                return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
            }
            if (!db._state.isBeingOpened) {
                if (!db._options.autoOpen)
                    return rejection(new exceptions.DatabaseClosed());
                db.open().catch(nop);
            }
            return db._state.dbReadyPromise.then(() => tempTransaction(db, mode, storeNames, fn));
        }
        else {
            var trans = db._createTransaction(mode, storeNames, db._dbSchema);
            try {
                trans.create();
                db._state.PR1398_maxLoop = 3;
            }
            catch (ex) {
                if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                    console.warn('Dexie: Need to reopen db');
                    db._close();
                    return db.open().then(() => tempTransaction(db, mode, storeNames, fn));
                }
                return rejection(ex);
            }
            return trans._promise(mode, (resolve, reject) => {
                return newScope(() => {
                    PSD.trans = trans;
                    return fn(resolve, reject, trans);
                });
            }).then(result => {
                return trans._completion.then(() => result);
            });
        }
    }

    const DEXIE_VERSION = '3.2.3';
    const maxString = String.fromCharCode(65535);
    const minKey = -Infinity;
    const INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
    const STRING_EXPECTED = "String expected.";
    const connections = [];
    const isIEOrEdge = typeof navigator !== 'undefined' && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
    const hasIEDeleteObjectStoreBug = isIEOrEdge;
    const hangsOnDeleteLargeKeyRange = isIEOrEdge;
    const dexieStackFrameFilter = frame => !/(dexie\.js|dexie\.min\.js)/.test(frame);
    const DBNAMES_DB = '__dbnames';
    const READONLY = 'readonly';
    const READWRITE = 'readwrite';

    function combine(filter1, filter2) {
        return filter1 ?
            filter2 ?
                function () { return filter1.apply(this, arguments) && filter2.apply(this, arguments); } :
                filter1 :
            filter2;
    }

    const AnyRange = {
        type: 3 ,
        lower: -Infinity,
        lowerOpen: false,
        upper: [[]],
        upperOpen: false
    };

    function workaroundForUndefinedPrimKey(keyPath) {
        return typeof keyPath === "string" && !/\./.test(keyPath)
            ? (obj) => {
                if (obj[keyPath] === undefined && (keyPath in obj)) {
                    obj = deepClone(obj);
                    delete obj[keyPath];
                }
                return obj;
            }
            : (obj) => obj;
    }

    class Table {
        _trans(mode, fn, writeLocked) {
            const trans = this._tx || PSD.trans;
            const tableName = this.name;
            function checkTableInTransaction(resolve, reject, trans) {
                if (!trans.schema[tableName])
                    throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
                return fn(trans.idbtrans, trans);
            }
            const wasRootExec = beginMicroTickScope();
            try {
                return trans && trans.db === this.db ?
                    trans === PSD.trans ?
                        trans._promise(mode, checkTableInTransaction, writeLocked) :
                        newScope(() => trans._promise(mode, checkTableInTransaction, writeLocked), { trans: trans, transless: PSD.transless || PSD }) :
                    tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
            }
            finally {
                if (wasRootExec)
                    endMicroTickScope();
            }
        }
        get(keyOrCrit, cb) {
            if (keyOrCrit && keyOrCrit.constructor === Object)
                return this.where(keyOrCrit).first(cb);
            return this._trans('readonly', (trans) => {
                return this.core.get({ trans, key: keyOrCrit })
                    .then(res => this.hook.reading.fire(res));
            }).then(cb);
        }
        where(indexOrCrit) {
            if (typeof indexOrCrit === 'string')
                return new this.db.WhereClause(this, indexOrCrit);
            if (isArray(indexOrCrit))
                return new this.db.WhereClause(this, `[${indexOrCrit.join('+')}]`);
            const keyPaths = keys(indexOrCrit);
            if (keyPaths.length === 1)
                return this
                    .where(keyPaths[0])
                    .equals(indexOrCrit[keyPaths[0]]);
            const compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(ix => ix.compound &&
                keyPaths.every(keyPath => ix.keyPath.indexOf(keyPath) >= 0) &&
                ix.keyPath.every(keyPath => keyPaths.indexOf(keyPath) >= 0))[0];
            if (compoundIndex && this.db._maxKey !== maxString)
                return this
                    .where(compoundIndex.name)
                    .equals(compoundIndex.keyPath.map(kp => indexOrCrit[kp]));
            if (!compoundIndex && debug)
                console.warn(`The query ${JSON.stringify(indexOrCrit)} on ${this.name} would benefit of a ` +
                    `compound index [${keyPaths.join('+')}]`);
            const { idxByName } = this.schema;
            const idb = this.db._deps.indexedDB;
            function equals(a, b) {
                try {
                    return idb.cmp(a, b) === 0;
                }
                catch (e) {
                    return false;
                }
            }
            const [idx, filterFunction] = keyPaths.reduce(([prevIndex, prevFilterFn], keyPath) => {
                const index = idxByName[keyPath];
                const value = indexOrCrit[keyPath];
                return [
                    prevIndex || index,
                    prevIndex || !index ?
                        combine(prevFilterFn, index && index.multi ?
                            x => {
                                const prop = getByKeyPath(x, keyPath);
                                return isArray(prop) && prop.some(item => equals(value, item));
                            } : x => equals(value, getByKeyPath(x, keyPath)))
                        : prevFilterFn
                ];
            }, [null, null]);
            return idx ?
                this.where(idx.name).equals(indexOrCrit[idx.keyPath])
                    .filter(filterFunction) :
                compoundIndex ?
                    this.filter(filterFunction) :
                    this.where(keyPaths).equals('');
        }
        filter(filterFunction) {
            return this.toCollection().and(filterFunction);
        }
        count(thenShortcut) {
            return this.toCollection().count(thenShortcut);
        }
        offset(offset) {
            return this.toCollection().offset(offset);
        }
        limit(numRows) {
            return this.toCollection().limit(numRows);
        }
        each(callback) {
            return this.toCollection().each(callback);
        }
        toArray(thenShortcut) {
            return this.toCollection().toArray(thenShortcut);
        }
        toCollection() {
            return new this.db.Collection(new this.db.WhereClause(this));
        }
        orderBy(index) {
            return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ?
                `[${index.join('+')}]` :
                index));
        }
        reverse() {
            return this.toCollection().reverse();
        }
        mapToClass(constructor) {
            this.schema.mappedClass = constructor;
            const readHook = obj => {
                if (!obj)
                    return obj;
                const res = Object.create(constructor.prototype);
                for (var m in obj)
                    if (hasOwn(obj, m))
                        try {
                            res[m] = obj[m];
                        }
                        catch (_) { }
                return res;
            };
            if (this.schema.readHook) {
                this.hook.reading.unsubscribe(this.schema.readHook);
            }
            this.schema.readHook = readHook;
            this.hook("reading", readHook);
            return constructor;
        }
        defineClass() {
            function Class(content) {
                extend(this, content);
            }
            return this.mapToClass(Class);
        }
        add(obj, key) {
            const { auto, keyPath } = this.schema.primKey;
            let objToAdd = obj;
            if (keyPath && auto) {
                objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
            }
            return this._trans('readwrite', trans => {
                return this.core.mutate({ trans, type: 'add', keys: key != null ? [key] : null, values: [objToAdd] });
            }).then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult)
                .then(lastResult => {
                if (keyPath) {
                    try {
                        setByKeyPath(obj, keyPath, lastResult);
                    }
                    catch (_) { }
                }
                return lastResult;
            });
        }
        update(keyOrObject, modifications) {
            if (typeof keyOrObject === 'object' && !isArray(keyOrObject)) {
                const key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
                if (key === undefined)
                    return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
                try {
                    if (typeof modifications !== "function") {
                        keys(modifications).forEach(keyPath => {
                            setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
                        });
                    }
                    else {
                        modifications(keyOrObject, { value: keyOrObject, primKey: key });
                    }
                }
                catch (_a) {
                }
                return this.where(":id").equals(key).modify(modifications);
            }
            else {
                return this.where(":id").equals(keyOrObject).modify(modifications);
            }
        }
        put(obj, key) {
            const { auto, keyPath } = this.schema.primKey;
            let objToAdd = obj;
            if (keyPath && auto) {
                objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
            }
            return this._trans('readwrite', trans => this.core.mutate({ trans, type: 'put', values: [objToAdd], keys: key != null ? [key] : null }))
                .then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult)
                .then(lastResult => {
                if (keyPath) {
                    try {
                        setByKeyPath(obj, keyPath, lastResult);
                    }
                    catch (_) { }
                }
                return lastResult;
            });
        }
        delete(key) {
            return this._trans('readwrite', trans => this.core.mutate({ trans, type: 'delete', keys: [key] }))
                .then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined);
        }
        clear() {
            return this._trans('readwrite', trans => this.core.mutate({ trans, type: 'deleteRange', range: AnyRange }))
                .then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined);
        }
        bulkGet(keys) {
            return this._trans('readonly', trans => {
                return this.core.getMany({
                    keys,
                    trans
                }).then(result => result.map(res => this.hook.reading.fire(res)));
            });
        }
        bulkAdd(objects, keysOrOptions, options) {
            const keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
            options = options || (keys ? undefined : keysOrOptions);
            const wantResults = options ? options.allKeys : undefined;
            return this._trans('readwrite', trans => {
                const { auto, keyPath } = this.schema.primKey;
                if (keyPath && keys)
                    throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
                if (keys && keys.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                const numObjects = objects.length;
                let objectsToAdd = keyPath && auto ?
                    objects.map(workaroundForUndefinedPrimKey(keyPath)) :
                    objects;
                return this.core.mutate({ trans, type: 'add', keys: keys, values: objectsToAdd, wantResults })
                    .then(({ numFailures, results, lastResult, failures }) => {
                    const result = wantResults ? results : lastResult;
                    if (numFailures === 0)
                        return result;
                    throw new BulkError(`${this.name}.bulkAdd(): ${numFailures} of ${numObjects} operations failed`, failures);
                });
            });
        }
        bulkPut(objects, keysOrOptions, options) {
            const keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
            options = options || (keys ? undefined : keysOrOptions);
            const wantResults = options ? options.allKeys : undefined;
            return this._trans('readwrite', trans => {
                const { auto, keyPath } = this.schema.primKey;
                if (keyPath && keys)
                    throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
                if (keys && keys.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                const numObjects = objects.length;
                let objectsToPut = keyPath && auto ?
                    objects.map(workaroundForUndefinedPrimKey(keyPath)) :
                    objects;
                return this.core.mutate({ trans, type: 'put', keys: keys, values: objectsToPut, wantResults })
                    .then(({ numFailures, results, lastResult, failures }) => {
                    const result = wantResults ? results : lastResult;
                    if (numFailures === 0)
                        return result;
                    throw new BulkError(`${this.name}.bulkPut(): ${numFailures} of ${numObjects} operations failed`, failures);
                });
            });
        }
        bulkDelete(keys) {
            const numKeys = keys.length;
            return this._trans('readwrite', trans => {
                return this.core.mutate({ trans, type: 'delete', keys: keys });
            }).then(({ numFailures, lastResult, failures }) => {
                if (numFailures === 0)
                    return lastResult;
                throw new BulkError(`${this.name}.bulkDelete(): ${numFailures} of ${numKeys} operations failed`, failures);
            });
        }
    }

    function Events(ctx) {
        var evs = {};
        var rv = function (eventName, subscriber) {
            if (subscriber) {
                var i = arguments.length, args = new Array(i - 1);
                while (--i)
                    args[i - 1] = arguments[i];
                evs[eventName].subscribe.apply(null, args);
                return ctx;
            }
            else if (typeof (eventName) === 'string') {
                return evs[eventName];
            }
        };
        rv.addEventType = add;
        for (var i = 1, l = arguments.length; i < l; ++i) {
            add(arguments[i]);
        }
        return rv;
        function add(eventName, chainFunction, defaultFunction) {
            if (typeof eventName === 'object')
                return addConfiguredEvents(eventName);
            if (!chainFunction)
                chainFunction = reverseStoppableEventChain;
            if (!defaultFunction)
                defaultFunction = nop;
            var context = {
                subscribers: [],
                fire: defaultFunction,
                subscribe: function (cb) {
                    if (context.subscribers.indexOf(cb) === -1) {
                        context.subscribers.push(cb);
                        context.fire = chainFunction(context.fire, cb);
                    }
                },
                unsubscribe: function (cb) {
                    context.subscribers = context.subscribers.filter(function (fn) { return fn !== cb; });
                    context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
                }
            };
            evs[eventName] = rv[eventName] = context;
            return context;
        }
        function addConfiguredEvents(cfg) {
            keys(cfg).forEach(function (eventName) {
                var args = cfg[eventName];
                if (isArray(args)) {
                    add(eventName, cfg[eventName][0], cfg[eventName][1]);
                }
                else if (args === 'asap') {
                    var context = add(eventName, mirror, function fire() {
                        var i = arguments.length, args = new Array(i);
                        while (i--)
                            args[i] = arguments[i];
                        context.subscribers.forEach(function (fn) {
                            asap$1(function fireEvent() {
                                fn.apply(null, args);
                            });
                        });
                    });
                }
                else
                    throw new exceptions.InvalidArgument("Invalid event config");
            });
        }
    }

    function makeClassConstructor(prototype, constructor) {
        derive(constructor).from({ prototype });
        return constructor;
    }

    function createTableConstructor(db) {
        return makeClassConstructor(Table.prototype, function Table(name, tableSchema, trans) {
            this.db = db;
            this._tx = trans;
            this.name = name;
            this.schema = tableSchema;
            this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
                "creating": [hookCreatingChain, nop],
                "reading": [pureFunctionChain, mirror],
                "updating": [hookUpdatingChain, nop],
                "deleting": [hookDeletingChain, nop]
            });
        });
    }

    function isPlainKeyRange(ctx, ignoreLimitFilter) {
        return !(ctx.filter || ctx.algorithm || ctx.or) &&
            (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
    }
    function addFilter(ctx, fn) {
        ctx.filter = combine(ctx.filter, fn);
    }
    function addReplayFilter(ctx, factory, isLimitFilter) {
        var curr = ctx.replayFilter;
        ctx.replayFilter = curr ? () => combine(curr(), factory()) : factory;
        ctx.justLimit = isLimitFilter && !curr;
    }
    function addMatchFilter(ctx, fn) {
        ctx.isMatch = combine(ctx.isMatch, fn);
    }
    function getIndexOrStore(ctx, coreSchema) {
        if (ctx.isPrimKey)
            return coreSchema.primaryKey;
        const index = coreSchema.getIndexByKeyPath(ctx.index);
        if (!index)
            throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
        return index;
    }
    function openCursor(ctx, coreTable, trans) {
        const index = getIndexOrStore(ctx, coreTable.schema);
        return coreTable.openCursor({
            trans,
            values: !ctx.keysOnly,
            reverse: ctx.dir === 'prev',
            unique: !!ctx.unique,
            query: {
                index,
                range: ctx.range
            }
        });
    }
    function iter(ctx, fn, coreTrans, coreTable) {
        const filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
        if (!ctx.or) {
            return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
        }
        else {
            const set = {};
            const union = (item, cursor, advance) => {
                if (!filter || filter(cursor, advance, result => cursor.stop(result), err => cursor.fail(err))) {
                    var primaryKey = cursor.primaryKey;
                    var key = '' + primaryKey;
                    if (key === '[object ArrayBuffer]')
                        key = '' + new Uint8Array(primaryKey);
                    if (!hasOwn(set, key)) {
                        set[key] = true;
                        fn(item, cursor, advance);
                    }
                }
            };
            return Promise.all([
                ctx.or._iterate(union, coreTrans),
                iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
            ]);
        }
    }
    function iterate(cursorPromise, filter, fn, valueMapper) {
        var mappedFn = valueMapper ? (x, c, a) => fn(valueMapper(x), c, a) : fn;
        var wrappedFn = wrap(mappedFn);
        return cursorPromise.then(cursor => {
            if (cursor) {
                return cursor.start(() => {
                    var c = () => cursor.continue();
                    if (!filter || filter(cursor, advancer => c = advancer, val => { cursor.stop(val); c = nop; }, e => { cursor.fail(e); c = nop; }))
                        wrappedFn(cursor.value, cursor, advancer => c = advancer);
                    c();
                });
            }
        });
    }

    function cmp(a, b) {
        try {
            const ta = type(a);
            const tb = type(b);
            if (ta !== tb) {
                if (ta === 'Array')
                    return 1;
                if (tb === 'Array')
                    return -1;
                if (ta === 'binary')
                    return 1;
                if (tb === 'binary')
                    return -1;
                if (ta === 'string')
                    return 1;
                if (tb === 'string')
                    return -1;
                if (ta === 'Date')
                    return 1;
                if (tb !== 'Date')
                    return NaN;
                return -1;
            }
            switch (ta) {
                case 'number':
                case 'Date':
                case 'string':
                    return a > b ? 1 : a < b ? -1 : 0;
                case 'binary': {
                    return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
                }
                case 'Array':
                    return compareArrays(a, b);
            }
        }
        catch (_a) { }
        return NaN;
    }
    function compareArrays(a, b) {
        const al = a.length;
        const bl = b.length;
        const l = al < bl ? al : bl;
        for (let i = 0; i < l; ++i) {
            const res = cmp(a[i], b[i]);
            if (res !== 0)
                return res;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
    }
    function compareUint8Arrays(a, b) {
        const al = a.length;
        const bl = b.length;
        const l = al < bl ? al : bl;
        for (let i = 0; i < l; ++i) {
            if (a[i] !== b[i])
                return a[i] < b[i] ? -1 : 1;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
    }
    function type(x) {
        const t = typeof x;
        if (t !== 'object')
            return t;
        if (ArrayBuffer.isView(x))
            return 'binary';
        const tsTag = toStringTag(x);
        return tsTag === 'ArrayBuffer' ? 'binary' : tsTag;
    }
    function getUint8Array(a) {
        if (a instanceof Uint8Array)
            return a;
        if (ArrayBuffer.isView(a))
            return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        return new Uint8Array(a);
    }

    class Collection {
        _read(fn, cb) {
            var ctx = this._ctx;
            return ctx.error ?
                ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                ctx.table._trans('readonly', fn).then(cb);
        }
        _write(fn) {
            var ctx = this._ctx;
            return ctx.error ?
                ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                ctx.table._trans('readwrite', fn, "locked");
        }
        _addAlgorithm(fn) {
            var ctx = this._ctx;
            ctx.algorithm = combine(ctx.algorithm, fn);
        }
        _iterate(fn, coreTrans) {
            return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
        }
        clone(props) {
            var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
            if (props)
                extend(ctx, props);
            rv._ctx = ctx;
            return rv;
        }
        raw() {
            this._ctx.valueMapper = null;
            return this;
        }
        each(fn) {
            var ctx = this._ctx;
            return this._read(trans => iter(ctx, fn, trans, ctx.table.core));
        }
        count(cb) {
            return this._read(trans => {
                const ctx = this._ctx;
                const coreTable = ctx.table.core;
                if (isPlainKeyRange(ctx, true)) {
                    return coreTable.count({
                        trans,
                        query: {
                            index: getIndexOrStore(ctx, coreTable.schema),
                            range: ctx.range
                        }
                    }).then(count => Math.min(count, ctx.limit));
                }
                else {
                    var count = 0;
                    return iter(ctx, () => { ++count; return false; }, trans, coreTable)
                        .then(() => count);
                }
            }).then(cb);
        }
        sortBy(keyPath, cb) {
            const parts = keyPath.split('.').reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
            function getval(obj, i) {
                if (i)
                    return getval(obj[parts[i]], i - 1);
                return obj[lastPart];
            }
            var order = this._ctx.dir === "next" ? 1 : -1;
            function sorter(a, b) {
                var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
                return aVal < bVal ? -order : aVal > bVal ? order : 0;
            }
            return this.toArray(function (a) {
                return a.sort(sorter);
            }).then(cb);
        }
        toArray(cb) {
            return this._read(trans => {
                var ctx = this._ctx;
                if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                    const { valueMapper } = ctx;
                    const index = getIndexOrStore(ctx, ctx.table.core.schema);
                    return ctx.table.core.query({
                        trans,
                        limit: ctx.limit,
                        values: true,
                        query: {
                            index,
                            range: ctx.range
                        }
                    }).then(({ result }) => valueMapper ? result.map(valueMapper) : result);
                }
                else {
                    const a = [];
                    return iter(ctx, item => a.push(item), trans, ctx.table.core).then(() => a);
                }
            }, cb);
        }
        offset(offset) {
            var ctx = this._ctx;
            if (offset <= 0)
                return this;
            ctx.offset += offset;
            if (isPlainKeyRange(ctx)) {
                addReplayFilter(ctx, () => {
                    var offsetLeft = offset;
                    return (cursor, advance) => {
                        if (offsetLeft === 0)
                            return true;
                        if (offsetLeft === 1) {
                            --offsetLeft;
                            return false;
                        }
                        advance(() => {
                            cursor.advance(offsetLeft);
                            offsetLeft = 0;
                        });
                        return false;
                    };
                });
            }
            else {
                addReplayFilter(ctx, () => {
                    var offsetLeft = offset;
                    return () => (--offsetLeft < 0);
                });
            }
            return this;
        }
        limit(numRows) {
            this._ctx.limit = Math.min(this._ctx.limit, numRows);
            addReplayFilter(this._ctx, () => {
                var rowsLeft = numRows;
                return function (cursor, advance, resolve) {
                    if (--rowsLeft <= 0)
                        advance(resolve);
                    return rowsLeft >= 0;
                };
            }, true);
            return this;
        }
        until(filterFunction, bIncludeStopEntry) {
            addFilter(this._ctx, function (cursor, advance, resolve) {
                if (filterFunction(cursor.value)) {
                    advance(resolve);
                    return bIncludeStopEntry;
                }
                else {
                    return true;
                }
            });
            return this;
        }
        first(cb) {
            return this.limit(1).toArray(function (a) { return a[0]; }).then(cb);
        }
        last(cb) {
            return this.reverse().first(cb);
        }
        filter(filterFunction) {
            addFilter(this._ctx, function (cursor) {
                return filterFunction(cursor.value);
            });
            addMatchFilter(this._ctx, filterFunction);
            return this;
        }
        and(filter) {
            return this.filter(filter);
        }
        or(indexName) {
            return new this.db.WhereClause(this._ctx.table, indexName, this);
        }
        reverse() {
            this._ctx.dir = (this._ctx.dir === "prev" ? "next" : "prev");
            if (this._ondirectionchange)
                this._ondirectionchange(this._ctx.dir);
            return this;
        }
        desc() {
            return this.reverse();
        }
        eachKey(cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function (val, cursor) { cb(cursor.key, cursor); });
        }
        eachUniqueKey(cb) {
            this._ctx.unique = "unique";
            return this.eachKey(cb);
        }
        eachPrimaryKey(cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function (val, cursor) { cb(cursor.primaryKey, cursor); });
        }
        keys(cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function (item, cursor) {
                a.push(cursor.key);
            }).then(function () {
                return a;
            }).then(cb);
        }
        primaryKeys(cb) {
            var ctx = this._ctx;
            if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                return this._read(trans => {
                    var index = getIndexOrStore(ctx, ctx.table.core.schema);
                    return ctx.table.core.query({
                        trans,
                        values: false,
                        limit: ctx.limit,
                        query: {
                            index,
                            range: ctx.range
                        }
                    });
                }).then(({ result }) => result).then(cb);
            }
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function (item, cursor) {
                a.push(cursor.primaryKey);
            }).then(function () {
                return a;
            }).then(cb);
        }
        uniqueKeys(cb) {
            this._ctx.unique = "unique";
            return this.keys(cb);
        }
        firstKey(cb) {
            return this.limit(1).keys(function (a) { return a[0]; }).then(cb);
        }
        lastKey(cb) {
            return this.reverse().firstKey(cb);
        }
        distinct() {
            var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
            if (!idx || !idx.multi)
                return this;
            var set = {};
            addFilter(this._ctx, function (cursor) {
                var strKey = cursor.primaryKey.toString();
                var found = hasOwn(set, strKey);
                set[strKey] = true;
                return !found;
            });
            return this;
        }
        modify(changes) {
            var ctx = this._ctx;
            return this._write(trans => {
                var modifyer;
                if (typeof changes === 'function') {
                    modifyer = changes;
                }
                else {
                    var keyPaths = keys(changes);
                    var numKeys = keyPaths.length;
                    modifyer = function (item) {
                        var anythingModified = false;
                        for (var i = 0; i < numKeys; ++i) {
                            var keyPath = keyPaths[i], val = changes[keyPath];
                            if (getByKeyPath(item, keyPath) !== val) {
                                setByKeyPath(item, keyPath, val);
                                anythingModified = true;
                            }
                        }
                        return anythingModified;
                    };
                }
                const coreTable = ctx.table.core;
                const { outbound, extractKey } = coreTable.schema.primaryKey;
                const limit = this.db._options.modifyChunkSize || 200;
                const totalFailures = [];
                let successCount = 0;
                const failedKeys = [];
                const applyMutateResult = (expectedCount, res) => {
                    const { failures, numFailures } = res;
                    successCount += expectedCount - numFailures;
                    for (let pos of keys(failures)) {
                        totalFailures.push(failures[pos]);
                    }
                };
                return this.clone().primaryKeys().then(keys => {
                    const nextChunk = (offset) => {
                        const count = Math.min(limit, keys.length - offset);
                        return coreTable.getMany({
                            trans,
                            keys: keys.slice(offset, offset + count),
                            cache: "immutable"
                        }).then(values => {
                            const addValues = [];
                            const putValues = [];
                            const putKeys = outbound ? [] : null;
                            const deleteKeys = [];
                            for (let i = 0; i < count; ++i) {
                                const origValue = values[i];
                                const ctx = {
                                    value: deepClone(origValue),
                                    primKey: keys[offset + i]
                                };
                                if (modifyer.call(ctx, ctx.value, ctx) !== false) {
                                    if (ctx.value == null) {
                                        deleteKeys.push(keys[offset + i]);
                                    }
                                    else if (!outbound && cmp(extractKey(origValue), extractKey(ctx.value)) !== 0) {
                                        deleteKeys.push(keys[offset + i]);
                                        addValues.push(ctx.value);
                                    }
                                    else {
                                        putValues.push(ctx.value);
                                        if (outbound)
                                            putKeys.push(keys[offset + i]);
                                    }
                                }
                            }
                            const criteria = isPlainKeyRange(ctx) &&
                                ctx.limit === Infinity &&
                                (typeof changes !== 'function' || changes === deleteCallback) && {
                                index: ctx.index,
                                range: ctx.range
                            };
                            return Promise.resolve(addValues.length > 0 &&
                                coreTable.mutate({ trans, type: 'add', values: addValues })
                                    .then(res => {
                                    for (let pos in res.failures) {
                                        deleteKeys.splice(parseInt(pos), 1);
                                    }
                                    applyMutateResult(addValues.length, res);
                                })).then(() => (putValues.length > 0 || (criteria && typeof changes === 'object')) &&
                                coreTable.mutate({
                                    trans,
                                    type: 'put',
                                    keys: putKeys,
                                    values: putValues,
                                    criteria,
                                    changeSpec: typeof changes !== 'function'
                                        && changes
                                }).then(res => applyMutateResult(putValues.length, res))).then(() => (deleteKeys.length > 0 || (criteria && changes === deleteCallback)) &&
                                coreTable.mutate({
                                    trans,
                                    type: 'delete',
                                    keys: deleteKeys,
                                    criteria
                                }).then(res => applyMutateResult(deleteKeys.length, res))).then(() => {
                                return keys.length > offset + count && nextChunk(offset + limit);
                            });
                        });
                    };
                    return nextChunk(0).then(() => {
                        if (totalFailures.length > 0)
                            throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                        return keys.length;
                    });
                });
            });
        }
        delete() {
            var ctx = this._ctx, range = ctx.range;
            if (isPlainKeyRange(ctx) &&
                ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || range.type === 3 ))
             {
                return this._write(trans => {
                    const { primaryKey } = ctx.table.core.schema;
                    const coreRange = range;
                    return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then(count => {
                        return ctx.table.core.mutate({ trans, type: 'deleteRange', range: coreRange })
                            .then(({ failures, lastResult, results, numFailures }) => {
                            if (numFailures)
                                throw new ModifyError("Could not delete some values", Object.keys(failures).map(pos => failures[pos]), count - numFailures);
                            return count - numFailures;
                        });
                    });
                });
            }
            return this.modify(deleteCallback);
        }
    }
    const deleteCallback = (value, ctx) => ctx.value = null;

    function createCollectionConstructor(db) {
        return makeClassConstructor(Collection.prototype, function Collection(whereClause, keyRangeGenerator) {
            this.db = db;
            let keyRange = AnyRange, error = null;
            if (keyRangeGenerator)
                try {
                    keyRange = keyRangeGenerator();
                }
                catch (ex) {
                    error = ex;
                }
            const whereCtx = whereClause._ctx;
            const table = whereCtx.table;
            const readingHook = table.hook.reading.fire;
            this._ctx = {
                table: table,
                index: whereCtx.index,
                isPrimKey: (!whereCtx.index || (table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name)),
                range: keyRange,
                keysOnly: false,
                dir: "next",
                unique: "",
                algorithm: null,
                filter: null,
                replayFilter: null,
                justLimit: true,
                isMatch: null,
                offset: 0,
                limit: Infinity,
                error: error,
                or: whereCtx.or,
                valueMapper: readingHook !== mirror ? readingHook : null
            };
        });
    }

    function simpleCompare(a, b) {
        return a < b ? -1 : a === b ? 0 : 1;
    }
    function simpleCompareReverse(a, b) {
        return a > b ? -1 : a === b ? 0 : 1;
    }

    function fail(collectionOrWhereClause, err, T) {
        var collection = collectionOrWhereClause instanceof WhereClause ?
            new collectionOrWhereClause.Collection(collectionOrWhereClause) :
            collectionOrWhereClause;
        collection._ctx.error = T ? new T(err) : new TypeError(err);
        return collection;
    }
    function emptyCollection(whereClause) {
        return new whereClause.Collection(whereClause, () => rangeEqual("")).limit(0);
    }
    function upperFactory(dir) {
        return dir === "next" ?
            (s) => s.toUpperCase() :
            (s) => s.toLowerCase();
    }
    function lowerFactory(dir) {
        return dir === "next" ?
            (s) => s.toLowerCase() :
            (s) => s.toUpperCase();
    }
    function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
        var length = Math.min(key.length, lowerNeedle.length);
        var llp = -1;
        for (var i = 0; i < length; ++i) {
            var lwrKeyChar = lowerKey[i];
            if (lwrKeyChar !== lowerNeedle[i]) {
                if (cmp(key[i], upperNeedle[i]) < 0)
                    return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
                if (cmp(key[i], lowerNeedle[i]) < 0)
                    return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
                if (llp >= 0)
                    return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
                return null;
            }
            if (cmp(key[i], lwrKeyChar) < 0)
                llp = i;
        }
        if (length < lowerNeedle.length && dir === "next")
            return key + upperNeedle.substr(key.length);
        if (length < key.length && dir === "prev")
            return key.substr(0, upperNeedle.length);
        return (llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1));
    }
    function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
        var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
        if (!needles.every(s => typeof s === 'string')) {
            return fail(whereClause, STRING_EXPECTED);
        }
        function initDirection(dir) {
            upper = upperFactory(dir);
            lower = lowerFactory(dir);
            compare = (dir === "next" ? simpleCompare : simpleCompareReverse);
            var needleBounds = needles.map(function (needle) {
                return { lower: lower(needle), upper: upper(needle) };
            }).sort(function (a, b) {
                return compare(a.lower, b.lower);
            });
            upperNeedles = needleBounds.map(function (nb) { return nb.upper; });
            lowerNeedles = needleBounds.map(function (nb) { return nb.lower; });
            direction = dir;
            nextKeySuffix = (dir === "next" ? "" : suffix);
        }
        initDirection("next");
        var c = new whereClause.Collection(whereClause, () => createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix));
        c._ondirectionchange = function (direction) {
            initDirection(direction);
        };
        var firstPossibleNeedle = 0;
        c._addAlgorithm(function (cursor, advance, resolve) {
            var key = cursor.key;
            if (typeof key !== 'string')
                return false;
            var lowerKey = lower(key);
            if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
                return true;
            }
            else {
                var lowestPossibleCasing = null;
                for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                    var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                    if (casing === null && lowestPossibleCasing === null)
                        firstPossibleNeedle = i + 1;
                    else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                        lowestPossibleCasing = casing;
                    }
                }
                if (lowestPossibleCasing !== null) {
                    advance(function () { cursor.continue(lowestPossibleCasing + nextKeySuffix); });
                }
                else {
                    advance(resolve);
                }
                return false;
            }
        });
        return c;
    }
    function createRange(lower, upper, lowerOpen, upperOpen) {
        return {
            type: 2 ,
            lower,
            upper,
            lowerOpen,
            upperOpen
        };
    }
    function rangeEqual(value) {
        return {
            type: 1 ,
            lower: value,
            upper: value
        };
    }

    class WhereClause {
        get Collection() {
            return this._ctx.table.db.Collection;
        }
        between(lower, upper, includeLower, includeUpper) {
            includeLower = includeLower !== false;
            includeUpper = includeUpper === true;
            try {
                if ((this._cmp(lower, upper) > 0) ||
                    (this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)))
                    return emptyCollection(this);
                return new this.Collection(this, () => createRange(lower, upper, !includeLower, !includeUpper));
            }
            catch (e) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
        }
        equals(value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, () => rangeEqual(value));
        }
        above(value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, () => createRange(value, undefined, true));
        }
        aboveOrEqual(value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, () => createRange(value, undefined, false));
        }
        below(value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, () => createRange(undefined, value, false, true));
        }
        belowOrEqual(value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, () => createRange(undefined, value));
        }
        startsWith(str) {
            if (typeof str !== 'string')
                return fail(this, STRING_EXPECTED);
            return this.between(str, str + maxString, true, true);
        }
        startsWithIgnoreCase(str) {
            if (str === "")
                return this.startsWith(str);
            return addIgnoreCaseAlgorithm(this, (x, a) => x.indexOf(a[0]) === 0, [str], maxString);
        }
        equalsIgnoreCase(str) {
            return addIgnoreCaseAlgorithm(this, (x, a) => x === a[0], [str], "");
        }
        anyOfIgnoreCase() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
                return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, (x, a) => a.indexOf(x) !== -1, set, "");
        }
        startsWithAnyOfIgnoreCase() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
                return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, (x, a) => a.some(n => x.indexOf(n) === 0), set, maxString);
        }
        anyOf() {
            const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            let compare = this._cmp;
            try {
                set.sort(compare);
            }
            catch (e) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
            if (set.length === 0)
                return emptyCollection(this);
            const c = new this.Collection(this, () => createRange(set[0], set[set.length - 1]));
            c._ondirectionchange = direction => {
                compare = (direction === "next" ?
                    this._ascending :
                    this._descending);
                set.sort(compare);
            };
            let i = 0;
            c._addAlgorithm((cursor, advance, resolve) => {
                const key = cursor.key;
                while (compare(key, set[i]) > 0) {
                    ++i;
                    if (i === set.length) {
                        advance(resolve);
                        return false;
                    }
                }
                if (compare(key, set[i]) === 0) {
                    return true;
                }
                else {
                    advance(() => { cursor.continue(set[i]); });
                    return false;
                }
            });
            return c;
        }
        notEqual(value) {
            return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
        }
        noneOf() {
            const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
                return new this.Collection(this);
            try {
                set.sort(this._ascending);
            }
            catch (e) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
            const ranges = set.reduce((res, val) => res ?
                res.concat([[res[res.length - 1][1], val]]) :
                [[minKey, val]], null);
            ranges.push([set[set.length - 1], this.db._maxKey]);
            return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
        }
        inAnyRange(ranges, options) {
            const cmp = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
            if (ranges.length === 0)
                return emptyCollection(this);
            if (!ranges.every(range => range[0] !== undefined &&
                range[1] !== undefined &&
                ascending(range[0], range[1]) <= 0)) {
                return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
            }
            const includeLowers = !options || options.includeLowers !== false;
            const includeUppers = options && options.includeUppers === true;
            function addRange(ranges, newRange) {
                let i = 0, l = ranges.length;
                for (; i < l; ++i) {
                    const range = ranges[i];
                    if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
                        range[0] = min(range[0], newRange[0]);
                        range[1] = max(range[1], newRange[1]);
                        break;
                    }
                }
                if (i === l)
                    ranges.push(newRange);
                return ranges;
            }
            let sortDirection = ascending;
            function rangeSorter(a, b) { return sortDirection(a[0], b[0]); }
            let set;
            try {
                set = ranges.reduce(addRange, []);
                set.sort(rangeSorter);
            }
            catch (ex) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
            let rangePos = 0;
            const keyIsBeyondCurrentEntry = includeUppers ?
                key => ascending(key, set[rangePos][1]) > 0 :
                key => ascending(key, set[rangePos][1]) >= 0;
            const keyIsBeforeCurrentEntry = includeLowers ?
                key => descending(key, set[rangePos][0]) > 0 :
                key => descending(key, set[rangePos][0]) >= 0;
            function keyWithinCurrentRange(key) {
                return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
            }
            let checkKey = keyIsBeyondCurrentEntry;
            const c = new this.Collection(this, () => createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers));
            c._ondirectionchange = direction => {
                if (direction === "next") {
                    checkKey = keyIsBeyondCurrentEntry;
                    sortDirection = ascending;
                }
                else {
                    checkKey = keyIsBeforeCurrentEntry;
                    sortDirection = descending;
                }
                set.sort(rangeSorter);
            };
            c._addAlgorithm((cursor, advance, resolve) => {
                var key = cursor.key;
                while (checkKey(key)) {
                    ++rangePos;
                    if (rangePos === set.length) {
                        advance(resolve);
                        return false;
                    }
                }
                if (keyWithinCurrentRange(key)) {
                    return true;
                }
                else if (this._cmp(key, set[rangePos][1]) === 0 || this._cmp(key, set[rangePos][0]) === 0) {
                    return false;
                }
                else {
                    advance(() => {
                        if (sortDirection === ascending)
                            cursor.continue(set[rangePos][0]);
                        else
                            cursor.continue(set[rangePos][1]);
                    });
                    return false;
                }
            });
            return c;
        }
        startsWithAnyOf() {
            const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (!set.every(s => typeof s === 'string')) {
                return fail(this, "startsWithAnyOf() only works with strings");
            }
            if (set.length === 0)
                return emptyCollection(this);
            return this.inAnyRange(set.map((str) => [str, str + maxString]));
        }
    }

    function createWhereClauseConstructor(db) {
        return makeClassConstructor(WhereClause.prototype, function WhereClause(table, index, orCollection) {
            this.db = db;
            this._ctx = {
                table: table,
                index: index === ":id" ? null : index,
                or: orCollection
            };
            const indexedDB = db._deps.indexedDB;
            if (!indexedDB)
                throw new exceptions.MissingAPI();
            this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
            this._descending = (a, b) => indexedDB.cmp(b, a);
            this._max = (a, b) => indexedDB.cmp(a, b) > 0 ? a : b;
            this._min = (a, b) => indexedDB.cmp(a, b) < 0 ? a : b;
            this._IDBKeyRange = db._deps.IDBKeyRange;
        });
    }

    function eventRejectHandler(reject) {
        return wrap(function (event) {
            preventDefault(event);
            reject(event.target.error);
            return false;
        });
    }
    function preventDefault(event) {
        if (event.stopPropagation)
            event.stopPropagation();
        if (event.preventDefault)
            event.preventDefault();
    }

    const DEXIE_STORAGE_MUTATED_EVENT_NAME = 'storagemutated';
    const STORAGE_MUTATED_DOM_EVENT_NAME = 'x-storagemutated-1';
    const globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);

    class Transaction {
        _lock() {
            assert(!PSD.global);
            ++this._reculock;
            if (this._reculock === 1 && !PSD.global)
                PSD.lockOwnerFor = this;
            return this;
        }
        _unlock() {
            assert(!PSD.global);
            if (--this._reculock === 0) {
                if (!PSD.global)
                    PSD.lockOwnerFor = null;
                while (this._blockedFuncs.length > 0 && !this._locked()) {
                    var fnAndPSD = this._blockedFuncs.shift();
                    try {
                        usePSD(fnAndPSD[1], fnAndPSD[0]);
                    }
                    catch (e) { }
                }
            }
            return this;
        }
        _locked() {
            return this._reculock && PSD.lockOwnerFor !== this;
        }
        create(idbtrans) {
            if (!this.mode)
                return this;
            const idbdb = this.db.idbdb;
            const dbOpenError = this.db._state.dbOpenError;
            assert(!this.idbtrans);
            if (!idbtrans && !idbdb) {
                switch (dbOpenError && dbOpenError.name) {
                    case "DatabaseClosedError":
                        throw new exceptions.DatabaseClosed(dbOpenError);
                    case "MissingAPIError":
                        throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                    default:
                        throw new exceptions.OpenFailed(dbOpenError);
                }
            }
            if (!this.active)
                throw new exceptions.TransactionInactive();
            assert(this._completion._state === null);
            idbtrans = this.idbtrans = idbtrans ||
                (this.db.core
                    ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })
                    : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
            idbtrans.onerror = wrap(ev => {
                preventDefault(ev);
                this._reject(idbtrans.error);
            });
            idbtrans.onabort = wrap(ev => {
                preventDefault(ev);
                this.active && this._reject(new exceptions.Abort(idbtrans.error));
                this.active = false;
                this.on("abort").fire(ev);
            });
            idbtrans.oncomplete = wrap(() => {
                this.active = false;
                this._resolve();
                if ('mutatedParts' in idbtrans) {
                    globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
                }
            });
            return this;
        }
        _promise(mode, fn, bWriteLock) {
            if (mode === 'readwrite' && this.mode !== 'readwrite')
                return rejection(new exceptions.ReadOnly("Transaction is readonly"));
            if (!this.active)
                return rejection(new exceptions.TransactionInactive());
            if (this._locked()) {
                return new DexiePromise((resolve, reject) => {
                    this._blockedFuncs.push([() => {
                            this._promise(mode, fn, bWriteLock).then(resolve, reject);
                        }, PSD]);
                });
            }
            else if (bWriteLock) {
                return newScope(() => {
                    var p = new DexiePromise((resolve, reject) => {
                        this._lock();
                        const rv = fn(resolve, reject, this);
                        if (rv && rv.then)
                            rv.then(resolve, reject);
                    });
                    p.finally(() => this._unlock());
                    p._lib = true;
                    return p;
                });
            }
            else {
                var p = new DexiePromise((resolve, reject) => {
                    var rv = fn(resolve, reject, this);
                    if (rv && rv.then)
                        rv.then(resolve, reject);
                });
                p._lib = true;
                return p;
            }
        }
        _root() {
            return this.parent ? this.parent._root() : this;
        }
        waitFor(promiseLike) {
            var root = this._root();
            const promise = DexiePromise.resolve(promiseLike);
            if (root._waitingFor) {
                root._waitingFor = root._waitingFor.then(() => promise);
            }
            else {
                root._waitingFor = promise;
                root._waitingQueue = [];
                var store = root.idbtrans.objectStore(root.storeNames[0]);
                (function spin() {
                    ++root._spinCount;
                    while (root._waitingQueue.length)
                        (root._waitingQueue.shift())();
                    if (root._waitingFor)
                        store.get(-Infinity).onsuccess = spin;
                }());
            }
            var currentWaitPromise = root._waitingFor;
            return new DexiePromise((resolve, reject) => {
                promise.then(res => root._waitingQueue.push(wrap(resolve.bind(null, res))), err => root._waitingQueue.push(wrap(reject.bind(null, err)))).finally(() => {
                    if (root._waitingFor === currentWaitPromise) {
                        root._waitingFor = null;
                    }
                });
            });
        }
        abort() {
            if (this.active) {
                this.active = false;
                if (this.idbtrans)
                    this.idbtrans.abort();
                this._reject(new exceptions.Abort());
            }
        }
        table(tableName) {
            const memoizedTables = (this._memoizedTables || (this._memoizedTables = {}));
            if (hasOwn(memoizedTables, tableName))
                return memoizedTables[tableName];
            const tableSchema = this.schema[tableName];
            if (!tableSchema) {
                throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            }
            const transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
            transactionBoundTable.core = this.db.core.table(tableName);
            memoizedTables[tableName] = transactionBoundTable;
            return transactionBoundTable;
        }
    }

    function createTransactionConstructor(db) {
        return makeClassConstructor(Transaction.prototype, function Transaction(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
            this.db = db;
            this.mode = mode;
            this.storeNames = storeNames;
            this.schema = dbschema;
            this.chromeTransactionDurability = chromeTransactionDurability;
            this.idbtrans = null;
            this.on = Events(this, "complete", "error", "abort");
            this.parent = parent || null;
            this.active = true;
            this._reculock = 0;
            this._blockedFuncs = [];
            this._resolve = null;
            this._reject = null;
            this._waitingFor = null;
            this._waitingQueue = null;
            this._spinCount = 0;
            this._completion = new DexiePromise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
            });
            this._completion.then(() => {
                this.active = false;
                this.on.complete.fire();
            }, e => {
                var wasActive = this.active;
                this.active = false;
                this.on.error.fire(e);
                this.parent ?
                    this.parent._reject(e) :
                    wasActive && this.idbtrans && this.idbtrans.abort();
                return rejection(e);
            });
        });
    }

    function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
        return {
            name,
            keyPath,
            unique,
            multi,
            auto,
            compound,
            src: (unique && !isPrimKey ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + nameFromKeyPath(keyPath)
        };
    }
    function nameFromKeyPath(keyPath) {
        return typeof keyPath === 'string' ?
            keyPath :
            keyPath ? ('[' + [].join.call(keyPath, '+') + ']') : "";
    }

    function createTableSchema(name, primKey, indexes) {
        return {
            name,
            primKey,
            indexes,
            mappedClass: null,
            idxByName: arrayToObject(indexes, index => [index.name, index])
        };
    }

    function safariMultiStoreFix(storeNames) {
        return storeNames.length === 1 ? storeNames[0] : storeNames;
    }
    let getMaxKey = (IdbKeyRange) => {
        try {
            IdbKeyRange.only([[]]);
            getMaxKey = () => [[]];
            return [[]];
        }
        catch (e) {
            getMaxKey = () => maxString;
            return maxString;
        }
    };

    function getKeyExtractor(keyPath) {
        if (keyPath == null) {
            return () => undefined;
        }
        else if (typeof keyPath === 'string') {
            return getSinglePathKeyExtractor(keyPath);
        }
        else {
            return obj => getByKeyPath(obj, keyPath);
        }
    }
    function getSinglePathKeyExtractor(keyPath) {
        const split = keyPath.split('.');
        if (split.length === 1) {
            return obj => obj[keyPath];
        }
        else {
            return obj => getByKeyPath(obj, keyPath);
        }
    }

    function arrayify(arrayLike) {
        return [].slice.call(arrayLike);
    }
    let _id_counter = 0;
    function getKeyPathAlias(keyPath) {
        return keyPath == null ?
            ":id" :
            typeof keyPath === 'string' ?
                keyPath :
                `[${keyPath.join('+')}]`;
    }
    function createDBCore(db, IdbKeyRange, tmpTrans) {
        function extractSchema(db, trans) {
            const tables = arrayify(db.objectStoreNames);
            return {
                schema: {
                    name: db.name,
                    tables: tables.map(table => trans.objectStore(table)).map(store => {
                        const { keyPath, autoIncrement } = store;
                        const compound = isArray(keyPath);
                        const outbound = keyPath == null;
                        const indexByKeyPath = {};
                        const result = {
                            name: store.name,
                            primaryKey: {
                                name: null,
                                isPrimaryKey: true,
                                outbound,
                                compound,
                                keyPath,
                                autoIncrement,
                                unique: true,
                                extractKey: getKeyExtractor(keyPath)
                            },
                            indexes: arrayify(store.indexNames).map(indexName => store.index(indexName))
                                .map(index => {
                                const { name, unique, multiEntry, keyPath } = index;
                                const compound = isArray(keyPath);
                                const result = {
                                    name,
                                    compound,
                                    keyPath,
                                    unique,
                                    multiEntry,
                                    extractKey: getKeyExtractor(keyPath)
                                };
                                indexByKeyPath[getKeyPathAlias(keyPath)] = result;
                                return result;
                            }),
                            getIndexByKeyPath: (keyPath) => indexByKeyPath[getKeyPathAlias(keyPath)]
                        };
                        indexByKeyPath[":id"] = result.primaryKey;
                        if (keyPath != null) {
                            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                        }
                        return result;
                    })
                },
                hasGetAll: tables.length > 0 && ('getAll' in trans.objectStore(tables[0])) &&
                    !(typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
                        !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
                        [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
            };
        }
        function makeIDBKeyRange(range) {
            if (range.type === 3 )
                return null;
            if (range.type === 4 )
                throw new Error("Cannot convert never type to IDBKeyRange");
            const { lower, upper, lowerOpen, upperOpen } = range;
            const idbRange = lower === undefined ?
                upper === undefined ?
                    null :
                    IdbKeyRange.upperBound(upper, !!upperOpen) :
                upper === undefined ?
                    IdbKeyRange.lowerBound(lower, !!lowerOpen) :
                    IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
            return idbRange;
        }
        function createDbCoreTable(tableSchema) {
            const tableName = tableSchema.name;
            function mutate({ trans, type, keys, values, range }) {
                return new Promise((resolve, reject) => {
                    resolve = wrap(resolve);
                    const store = trans.objectStore(tableName);
                    const outbound = store.keyPath == null;
                    const isAddOrPut = type === "put" || type === "add";
                    if (!isAddOrPut && type !== 'delete' && type !== 'deleteRange')
                        throw new Error("Invalid operation type: " + type);
                    const { length } = keys || values || { length: 1 };
                    if (keys && values && keys.length !== values.length) {
                        throw new Error("Given keys array must have same length as given values array.");
                    }
                    if (length === 0)
                        return resolve({ numFailures: 0, failures: {}, results: [], lastResult: undefined });
                    let req;
                    const reqs = [];
                    const failures = [];
                    let numFailures = 0;
                    const errorHandler = event => {
                        ++numFailures;
                        preventDefault(event);
                    };
                    if (type === 'deleteRange') {
                        if (range.type === 4 )
                            return resolve({ numFailures, failures, results: [], lastResult: undefined });
                        if (range.type === 3 )
                            reqs.push(req = store.clear());
                        else
                            reqs.push(req = store.delete(makeIDBKeyRange(range)));
                    }
                    else {
                        const [args1, args2] = isAddOrPut ?
                            outbound ?
                                [values, keys] :
                                [values, null] :
                            [keys, null];
                        if (isAddOrPut) {
                            for (let i = 0; i < length; ++i) {
                                reqs.push(req = (args2 && args2[i] !== undefined ?
                                    store[type](args1[i], args2[i]) :
                                    store[type](args1[i])));
                                req.onerror = errorHandler;
                            }
                        }
                        else {
                            for (let i = 0; i < length; ++i) {
                                reqs.push(req = store[type](args1[i]));
                                req.onerror = errorHandler;
                            }
                        }
                    }
                    const done = event => {
                        const lastResult = event.target.result;
                        reqs.forEach((req, i) => req.error != null && (failures[i] = req.error));
                        resolve({
                            numFailures,
                            failures,
                            results: type === "delete" ? keys : reqs.map(req => req.result),
                            lastResult
                        });
                    };
                    req.onerror = event => {
                        errorHandler(event);
                        done(event);
                    };
                    req.onsuccess = done;
                });
            }
            function openCursor({ trans, values, query, reverse, unique }) {
                return new Promise((resolve, reject) => {
                    resolve = wrap(resolve);
                    const { index, range } = query;
                    const store = trans.objectStore(tableName);
                    const source = index.isPrimaryKey ?
                        store :
                        store.index(index.name);
                    const direction = reverse ?
                        unique ?
                            "prevunique" :
                            "prev" :
                        unique ?
                            "nextunique" :
                            "next";
                    const req = values || !('openKeyCursor' in source) ?
                        source.openCursor(makeIDBKeyRange(range), direction) :
                        source.openKeyCursor(makeIDBKeyRange(range), direction);
                    req.onerror = eventRejectHandler(reject);
                    req.onsuccess = wrap(ev => {
                        const cursor = req.result;
                        if (!cursor) {
                            resolve(null);
                            return;
                        }
                        cursor.___id = ++_id_counter;
                        cursor.done = false;
                        const _cursorContinue = cursor.continue.bind(cursor);
                        let _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                        if (_cursorContinuePrimaryKey)
                            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                        const _cursorAdvance = cursor.advance.bind(cursor);
                        const doThrowCursorIsNotStarted = () => { throw new Error("Cursor not started"); };
                        const doThrowCursorIsStopped = () => { throw new Error("Cursor not stopped"); };
                        cursor.trans = trans;
                        cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                        cursor.fail = wrap(reject);
                        cursor.next = function () {
                            let gotOne = 1;
                            return this.start(() => gotOne-- ? this.continue() : this.stop()).then(() => this);
                        };
                        cursor.start = (callback) => {
                            const iterationPromise = new Promise((resolveIteration, rejectIteration) => {
                                resolveIteration = wrap(resolveIteration);
                                req.onerror = eventRejectHandler(rejectIteration);
                                cursor.fail = rejectIteration;
                                cursor.stop = value => {
                                    cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                                    resolveIteration(value);
                                };
                            });
                            const guardedCallback = () => {
                                if (req.result) {
                                    try {
                                        callback();
                                    }
                                    catch (err) {
                                        cursor.fail(err);
                                    }
                                }
                                else {
                                    cursor.done = true;
                                    cursor.start = () => { throw new Error("Cursor behind last entry"); };
                                    cursor.stop();
                                }
                            };
                            req.onsuccess = wrap(ev => {
                                req.onsuccess = guardedCallback;
                                guardedCallback();
                            });
                            cursor.continue = _cursorContinue;
                            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                            cursor.advance = _cursorAdvance;
                            guardedCallback();
                            return iterationPromise;
                        };
                        resolve(cursor);
                    }, reject);
                });
            }
            function query(hasGetAll) {
                return (request) => {
                    return new Promise((resolve, reject) => {
                        resolve = wrap(resolve);
                        const { trans, values, limit, query } = request;
                        const nonInfinitLimit = limit === Infinity ? undefined : limit;
                        const { index, range } = query;
                        const store = trans.objectStore(tableName);
                        const source = index.isPrimaryKey ? store : store.index(index.name);
                        const idbKeyRange = makeIDBKeyRange(range);
                        if (limit === 0)
                            return resolve({ result: [] });
                        if (hasGetAll) {
                            const req = values ?
                                source.getAll(idbKeyRange, nonInfinitLimit) :
                                source.getAllKeys(idbKeyRange, nonInfinitLimit);
                            req.onsuccess = event => resolve({ result: event.target.result });
                            req.onerror = eventRejectHandler(reject);
                        }
                        else {
                            let count = 0;
                            const req = values || !('openKeyCursor' in source) ?
                                source.openCursor(idbKeyRange) :
                                source.openKeyCursor(idbKeyRange);
                            const result = [];
                            req.onsuccess = event => {
                                const cursor = req.result;
                                if (!cursor)
                                    return resolve({ result });
                                result.push(values ? cursor.value : cursor.primaryKey);
                                if (++count === limit)
                                    return resolve({ result });
                                cursor.continue();
                            };
                            req.onerror = eventRejectHandler(reject);
                        }
                    });
                };
            }
            return {
                name: tableName,
                schema: tableSchema,
                mutate,
                getMany({ trans, keys }) {
                    return new Promise((resolve, reject) => {
                        resolve = wrap(resolve);
                        const store = trans.objectStore(tableName);
                        const length = keys.length;
                        const result = new Array(length);
                        let keyCount = 0;
                        let callbackCount = 0;
                        let req;
                        const successHandler = event => {
                            const req = event.target;
                            if ((result[req._pos] = req.result) != null)
                                ;
                            if (++callbackCount === keyCount)
                                resolve(result);
                        };
                        const errorHandler = eventRejectHandler(reject);
                        for (let i = 0; i < length; ++i) {
                            const key = keys[i];
                            if (key != null) {
                                req = store.get(keys[i]);
                                req._pos = i;
                                req.onsuccess = successHandler;
                                req.onerror = errorHandler;
                                ++keyCount;
                            }
                        }
                        if (keyCount === 0)
                            resolve(result);
                    });
                },
                get({ trans, key }) {
                    return new Promise((resolve, reject) => {
                        resolve = wrap(resolve);
                        const store = trans.objectStore(tableName);
                        const req = store.get(key);
                        req.onsuccess = event => resolve(event.target.result);
                        req.onerror = eventRejectHandler(reject);
                    });
                },
                query: query(hasGetAll),
                openCursor,
                count({ query, trans }) {
                    const { index, range } = query;
                    return new Promise((resolve, reject) => {
                        const store = trans.objectStore(tableName);
                        const source = index.isPrimaryKey ? store : store.index(index.name);
                        const idbKeyRange = makeIDBKeyRange(range);
                        const req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                        req.onsuccess = wrap(ev => resolve(ev.target.result));
                        req.onerror = eventRejectHandler(reject);
                    });
                }
            };
        }
        const { schema, hasGetAll } = extractSchema(db, tmpTrans);
        const tables = schema.tables.map(tableSchema => createDbCoreTable(tableSchema));
        const tableMap = {};
        tables.forEach(table => tableMap[table.name] = table);
        return {
            stack: "dbcore",
            transaction: db.transaction.bind(db),
            table(name) {
                const result = tableMap[name];
                if (!result)
                    throw new Error(`Table '${name}' not found`);
                return tableMap[name];
            },
            MIN_KEY: -Infinity,
            MAX_KEY: getMaxKey(IdbKeyRange),
            schema
        };
    }

    function createMiddlewareStack(stackImpl, middlewares) {
        return middlewares.reduce((down, { create }) => ({ ...down, ...create(down) }), stackImpl);
    }
    function createMiddlewareStacks(middlewares, idbdb, { IDBKeyRange, indexedDB }, tmpTrans) {
        const dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
        return {
            dbcore
        };
    }
    function generateMiddlewareStacks({ _novip: db }, tmpTrans) {
        const idbdb = tmpTrans.db;
        const stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
        db.core = stacks.dbcore;
        db.tables.forEach(table => {
            const tableName = table.name;
            if (db.core.schema.tables.some(tbl => tbl.name === tableName)) {
                table.core = db.core.table(tableName);
                if (db[tableName] instanceof db.Table) {
                    db[tableName].core = table.core;
                }
            }
        });
    }

    function setApiOnPlace({ _novip: db }, objs, tableNames, dbschema) {
        tableNames.forEach(tableName => {
            const schema = dbschema[tableName];
            objs.forEach(obj => {
                const propDesc = getPropertyDescriptor(obj, tableName);
                if (!propDesc || ("value" in propDesc && propDesc.value === undefined)) {
                    if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                        setProp(obj, tableName, {
                            get() { return this.table(tableName); },
                            set(value) {
                                defineProperty(this, tableName, { value, writable: true, configurable: true, enumerable: true });
                            }
                        });
                    }
                    else {
                        obj[tableName] = new db.Table(tableName, schema);
                    }
                }
            });
        });
    }
    function removeTablesApi({ _novip: db }, objs) {
        objs.forEach(obj => {
            for (let key in obj) {
                if (obj[key] instanceof db.Table)
                    delete obj[key];
            }
        });
    }
    function lowerVersionFirst(a, b) {
        return a._cfg.version - b._cfg.version;
    }
    function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
        const globalSchema = db._dbSchema;
        const trans = db._createTransaction('readwrite', db._storeNames, globalSchema);
        trans.create(idbUpgradeTrans);
        trans._completion.catch(reject);
        const rejectTransaction = trans._reject.bind(trans);
        const transless = PSD.transless || PSD;
        newScope(() => {
            PSD.trans = trans;
            PSD.transless = transless;
            if (oldVersion === 0) {
                keys(globalSchema).forEach(tableName => {
                    createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
                });
                generateMiddlewareStacks(db, idbUpgradeTrans);
                DexiePromise.follow(() => db.on.populate.fire(trans)).catch(rejectTransaction);
            }
            else
                updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
        });
    }
    function updateTablesAndIndexes({ _novip: db }, oldVersion, trans, idbUpgradeTrans) {
        const queue = [];
        const versions = db._versions;
        let globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
        let anyContentUpgraderHasRun = false;
        const versToRun = versions.filter(v => v._cfg.version >= oldVersion);
        versToRun.forEach(version => {
            queue.push(() => {
                const oldSchema = globalSchema;
                const newSchema = version._cfg.dbschema;
                adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
                adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
                globalSchema = db._dbSchema = newSchema;
                const diff = getSchemaDiff(oldSchema, newSchema);
                diff.add.forEach(tuple => {
                    createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
                });
                diff.change.forEach(change => {
                    if (change.recreate) {
                        throw new exceptions.Upgrade("Not yet support for changing primary key");
                    }
                    else {
                        const store = idbUpgradeTrans.objectStore(change.name);
                        change.add.forEach(idx => addIndex(store, idx));
                        change.change.forEach(idx => {
                            store.deleteIndex(idx.name);
                            addIndex(store, idx);
                        });
                        change.del.forEach(idxName => store.deleteIndex(idxName));
                    }
                });
                const contentUpgrade = version._cfg.contentUpgrade;
                if (contentUpgrade && version._cfg.version > oldVersion) {
                    generateMiddlewareStacks(db, idbUpgradeTrans);
                    trans._memoizedTables = {};
                    anyContentUpgraderHasRun = true;
                    let upgradeSchema = shallowClone(newSchema);
                    diff.del.forEach(table => {
                        upgradeSchema[table] = oldSchema[table];
                    });
                    removeTablesApi(db, [db.Transaction.prototype]);
                    setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema), upgradeSchema);
                    trans.schema = upgradeSchema;
                    const contentUpgradeIsAsync = isAsyncFunction(contentUpgrade);
                    if (contentUpgradeIsAsync) {
                        incrementExpectedAwaits();
                    }
                    let returnValue;
                    const promiseFollowed = DexiePromise.follow(() => {
                        returnValue = contentUpgrade(trans);
                        if (returnValue) {
                            if (contentUpgradeIsAsync) {
                                var decrementor = decrementExpectedAwaits.bind(null, null);
                                returnValue.then(decrementor, decrementor);
                            }
                        }
                    });
                    return (returnValue && typeof returnValue.then === 'function' ?
                        DexiePromise.resolve(returnValue) : promiseFollowed.then(() => returnValue));
                }
            });
            queue.push(idbtrans => {
                if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
                    const newSchema = version._cfg.dbschema;
                    deleteRemovedTables(newSchema, idbtrans);
                }
                removeTablesApi(db, [db.Transaction.prototype]);
                setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
                trans.schema = db._dbSchema;
            });
        });
        function runQueue() {
            return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) :
                DexiePromise.resolve();
        }
        return runQueue().then(() => {
            createMissingTables(globalSchema, idbUpgradeTrans);
        });
    }
    function getSchemaDiff(oldSchema, newSchema) {
        const diff = {
            del: [],
            add: [],
            change: []
        };
        let table;
        for (table in oldSchema) {
            if (!newSchema[table])
                diff.del.push(table);
        }
        for (table in newSchema) {
            const oldDef = oldSchema[table], newDef = newSchema[table];
            if (!oldDef) {
                diff.add.push([table, newDef]);
            }
            else {
                const change = {
                    name: table,
                    def: newDef,
                    recreate: false,
                    del: [],
                    add: [],
                    change: []
                };
                if ((
                '' + (oldDef.primKey.keyPath || '')) !== ('' + (newDef.primKey.keyPath || '')) ||
                    (oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge))
                 {
                    change.recreate = true;
                    diff.change.push(change);
                }
                else {
                    const oldIndexes = oldDef.idxByName;
                    const newIndexes = newDef.idxByName;
                    let idxName;
                    for (idxName in oldIndexes) {
                        if (!newIndexes[idxName])
                            change.del.push(idxName);
                    }
                    for (idxName in newIndexes) {
                        const oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                        if (!oldIdx)
                            change.add.push(newIdx);
                        else if (oldIdx.src !== newIdx.src)
                            change.change.push(newIdx);
                    }
                    if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                        diff.change.push(change);
                    }
                }
            }
        }
        return diff;
    }
    function createTable(idbtrans, tableName, primKey, indexes) {
        const store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ?
            { keyPath: primKey.keyPath, autoIncrement: primKey.auto } :
            { autoIncrement: primKey.auto });
        indexes.forEach(idx => addIndex(store, idx));
        return store;
    }
    function createMissingTables(newSchema, idbtrans) {
        keys(newSchema).forEach(tableName => {
            if (!idbtrans.db.objectStoreNames.contains(tableName)) {
                createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
            }
        });
    }
    function deleteRemovedTables(newSchema, idbtrans) {
        [].slice.call(idbtrans.db.objectStoreNames).forEach(storeName => newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName));
    }
    function addIndex(store, idx) {
        store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
    }
    function buildGlobalSchema(db, idbdb, tmpTrans) {
        const globalSchema = {};
        const dbStoreNames = slice(idbdb.objectStoreNames, 0);
        dbStoreNames.forEach(storeName => {
            const store = tmpTrans.objectStore(storeName);
            let keyPath = store.keyPath;
            const primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
            const indexes = [];
            for (let j = 0; j < store.indexNames.length; ++j) {
                const idbindex = store.index(store.indexNames[j]);
                keyPath = idbindex.keyPath;
                var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
                indexes.push(index);
            }
            globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
        });
        return globalSchema;
    }
    function readGlobalSchema({ _novip: db }, idbdb, tmpTrans) {
        db.verno = idbdb.version / 10;
        const globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
        db._storeNames = slice(idbdb.objectStoreNames, 0);
        setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
    }
    function verifyInstalledSchema(db, tmpTrans) {
        const installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
        const diff = getSchemaDiff(installedSchema, db._dbSchema);
        return !(diff.add.length || diff.change.some(ch => ch.add.length || ch.change.length));
    }
    function adjustToExistingIndexNames({ _novip: db }, schema, idbtrans) {
        const storeNames = idbtrans.db.objectStoreNames;
        for (let i = 0; i < storeNames.length; ++i) {
            const storeName = storeNames[i];
            const store = idbtrans.objectStore(storeName);
            db._hasGetAll = 'getAll' in store;
            for (let j = 0; j < store.indexNames.length; ++j) {
                const indexName = store.indexNames[j];
                const keyPath = store.index(indexName).keyPath;
                const dexieName = typeof keyPath === 'string' ? keyPath : "[" + slice(keyPath).join('+') + "]";
                if (schema[storeName]) {
                    const indexSpec = schema[storeName].idxByName[dexieName];
                    if (indexSpec) {
                        indexSpec.name = indexName;
                        delete schema[storeName].idxByName[dexieName];
                        schema[storeName].idxByName[indexName] = indexSpec;
                    }
                }
            }
        }
        if (typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
            !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
            _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope &&
            [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
            db._hasGetAll = false;
        }
    }
    function parseIndexSyntax(primKeyAndIndexes) {
        return primKeyAndIndexes.split(',').map((index, indexNum) => {
            index = index.trim();
            const name = index.replace(/([&*]|\+\+)/g, "");
            const keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split('+') : name;
            return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
        });
    }

    class Version {
        _parseStoresSpec(stores, outSchema) {
            keys(stores).forEach(tableName => {
                if (stores[tableName] !== null) {
                    var indexes = parseIndexSyntax(stores[tableName]);
                    var primKey = indexes.shift();
                    if (primKey.multi)
                        throw new exceptions.Schema("Primary key cannot be multi-valued");
                    indexes.forEach(idx => {
                        if (idx.auto)
                            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                        if (!idx.keyPath)
                            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                    });
                    outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
                }
            });
        }
        stores(stores) {
            const db = this.db;
            this._cfg.storesSource = this._cfg.storesSource ?
                extend(this._cfg.storesSource, stores) :
                stores;
            const versions = db._versions;
            const storesSpec = {};
            let dbschema = {};
            versions.forEach(version => {
                extend(storesSpec, version._cfg.storesSource);
                dbschema = (version._cfg.dbschema = {});
                version._parseStoresSpec(storesSpec, dbschema);
            });
            db._dbSchema = dbschema;
            removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
            setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
            db._storeNames = keys(dbschema);
            return this;
        }
        upgrade(upgradeFunction) {
            this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
            return this;
        }
    }

    function createVersionConstructor(db) {
        return makeClassConstructor(Version.prototype, function Version(versionNumber) {
            this.db = db;
            this._cfg = {
                version: versionNumber,
                storesSource: null,
                dbschema: {},
                tables: {},
                contentUpgrade: null
            };
        });
    }

    function getDbNamesTable(indexedDB, IDBKeyRange) {
        let dbNamesDB = indexedDB["_dbNamesDB"];
        if (!dbNamesDB) {
            dbNamesDB = indexedDB["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
                addons: [],
                indexedDB,
                IDBKeyRange,
            });
            dbNamesDB.version(1).stores({ dbnames: "name" });
        }
        return dbNamesDB.table("dbnames");
    }
    function hasDatabasesNative(indexedDB) {
        return indexedDB && typeof indexedDB.databases === "function";
    }
    function getDatabaseNames({ indexedDB, IDBKeyRange, }) {
        return hasDatabasesNative(indexedDB)
            ? Promise.resolve(indexedDB.databases()).then((infos) => infos
                .map((info) => info.name)
                .filter((name) => name !== DBNAMES_DB))
            : getDbNamesTable(indexedDB, IDBKeyRange).toCollection().primaryKeys();
    }
    function _onDatabaseCreated({ indexedDB, IDBKeyRange }, name) {
        !hasDatabasesNative(indexedDB) &&
            name !== DBNAMES_DB &&
            getDbNamesTable(indexedDB, IDBKeyRange).put({ name }).catch(nop);
    }
    function _onDatabaseDeleted({ indexedDB, IDBKeyRange }, name) {
        !hasDatabasesNative(indexedDB) &&
            name !== DBNAMES_DB &&
            getDbNamesTable(indexedDB, IDBKeyRange).delete(name).catch(nop);
    }

    function vip(fn) {
        return newScope(function () {
            PSD.letThrough = true;
            return fn();
        });
    }

    function idbReady() {
        var isSafari = !navigator.userAgentData &&
            /Safari\//.test(navigator.userAgent) &&
            !/Chrom(e|ium)\//.test(navigator.userAgent);
        if (!isSafari || !indexedDB.databases)
            return Promise.resolve();
        var intervalId;
        return new Promise(function (resolve) {
            var tryIdb = function () { return indexedDB.databases().finally(resolve); };
            intervalId = setInterval(tryIdb, 100);
            tryIdb();
        }).finally(function () { return clearInterval(intervalId); });
    }

    function dexieOpen(db) {
        const state = db._state;
        const { indexedDB } = db._deps;
        if (state.isBeingOpened || db.idbdb)
            return state.dbReadyPromise.then(() => state.dbOpenError ?
                rejection(state.dbOpenError) :
                db);
        debug && (state.openCanceller._stackHolder = getErrorWithStack());
        state.isBeingOpened = true;
        state.dbOpenError = null;
        state.openComplete = false;
        const openCanceller = state.openCanceller;
        function throwIfCancelled() {
            if (state.openCanceller !== openCanceller)
                throw new exceptions.DatabaseClosed('db.open() was cancelled');
        }
        let resolveDbReady = state.dbReadyResolve,
        upgradeTransaction = null, wasCreated = false;
        return DexiePromise.race([openCanceller, (typeof navigator === 'undefined' ? DexiePromise.resolve() : idbReady()).then(() => new DexiePromise((resolve, reject) => {
                throwIfCancelled();
                if (!indexedDB)
                    throw new exceptions.MissingAPI();
                const dbName = db.name;
                const req = state.autoSchema ?
                    indexedDB.open(dbName) :
                    indexedDB.open(dbName, Math.round(db.verno * 10));
                if (!req)
                    throw new exceptions.MissingAPI();
                req.onerror = eventRejectHandler(reject);
                req.onblocked = wrap(db._fireOnBlocked);
                req.onupgradeneeded = wrap(e => {
                    upgradeTransaction = req.transaction;
                    if (state.autoSchema && !db._options.allowEmptyDB) {
                        req.onerror = preventDefault;
                        upgradeTransaction.abort();
                        req.result.close();
                        const delreq = indexedDB.deleteDatabase(dbName);
                        delreq.onsuccess = delreq.onerror = wrap(() => {
                            reject(new exceptions.NoSuchDatabase(`Database ${dbName} doesnt exist`));
                        });
                    }
                    else {
                        upgradeTransaction.onerror = eventRejectHandler(reject);
                        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                        wasCreated = oldVer < 1;
                        db._novip.idbdb = req.result;
                        runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
                    }
                }, reject);
                req.onsuccess = wrap(() => {
                    upgradeTransaction = null;
                    const idbdb = db._novip.idbdb = req.result;
                    const objectStoreNames = slice(idbdb.objectStoreNames);
                    if (objectStoreNames.length > 0)
                        try {
                            const tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), 'readonly');
                            if (state.autoSchema)
                                readGlobalSchema(db, idbdb, tmpTrans);
                            else {
                                adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                                if (!verifyInstalledSchema(db, tmpTrans)) {
                                    console.warn(`Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.`);
                                }
                            }
                            generateMiddlewareStacks(db, tmpTrans);
                        }
                        catch (e) {
                        }
                    connections.push(db);
                    idbdb.onversionchange = wrap(ev => {
                        state.vcFired = true;
                        db.on("versionchange").fire(ev);
                    });
                    idbdb.onclose = wrap(ev => {
                        db.on("close").fire(ev);
                    });
                    if (wasCreated)
                        _onDatabaseCreated(db._deps, dbName);
                    resolve();
                }, reject);
            }))]).then(() => {
            throwIfCancelled();
            state.onReadyBeingFired = [];
            return DexiePromise.resolve(vip(() => db.on.ready.fire(db.vip))).then(function fireRemainders() {
                if (state.onReadyBeingFired.length > 0) {
                    let remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
                    state.onReadyBeingFired = [];
                    return DexiePromise.resolve(vip(() => remainders(db.vip))).then(fireRemainders);
                }
            });
        }).finally(() => {
            state.onReadyBeingFired = null;
            state.isBeingOpened = false;
        }).then(() => {
            return db;
        }).catch(err => {
            state.dbOpenError = err;
            try {
                upgradeTransaction && upgradeTransaction.abort();
            }
            catch (_a) { }
            if (openCanceller === state.openCanceller) {
                db._close();
            }
            return rejection(err);
        }).finally(() => {
            state.openComplete = true;
            resolveDbReady();
        });
    }

    function awaitIterator(iterator) {
        var callNext = result => iterator.next(result), doThrow = error => iterator.throw(error), onSuccess = step(callNext), onError = step(doThrow);
        function step(getNext) {
            return (val) => {
                var next = getNext(val), value = next.value;
                return next.done ? value :
                    (!value || typeof value.then !== 'function' ?
                        isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) :
                        value.then(onSuccess, onError));
            };
        }
        return step(callNext)();
    }

    function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
        var i = arguments.length;
        if (i < 2)
            throw new exceptions.InvalidArgument("Too few arguments");
        var args = new Array(i - 1);
        while (--i)
            args[i - 1] = arguments[i];
        scopeFunc = args.pop();
        var tables = flatten(args);
        return [mode, tables, scopeFunc];
    }
    function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
        return DexiePromise.resolve().then(() => {
            const transless = PSD.transless || PSD;
            const trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
            const zoneProps = {
                trans: trans,
                transless: transless
            };
            if (parentTransaction) {
                trans.idbtrans = parentTransaction.idbtrans;
            }
            else {
                try {
                    trans.create();
                    db._state.PR1398_maxLoop = 3;
                }
                catch (ex) {
                    if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                        console.warn('Dexie: Need to reopen db');
                        db._close();
                        return db.open().then(() => enterTransactionScope(db, mode, storeNames, null, scopeFunc));
                    }
                    return rejection(ex);
                }
            }
            const scopeFuncIsAsync = isAsyncFunction(scopeFunc);
            if (scopeFuncIsAsync) {
                incrementExpectedAwaits();
            }
            let returnValue;
            const promiseFollowed = DexiePromise.follow(() => {
                returnValue = scopeFunc.call(trans, trans);
                if (returnValue) {
                    if (scopeFuncIsAsync) {
                        var decrementor = decrementExpectedAwaits.bind(null, null);
                        returnValue.then(decrementor, decrementor);
                    }
                    else if (typeof returnValue.next === 'function' && typeof returnValue.throw === 'function') {
                        returnValue = awaitIterator(returnValue);
                    }
                }
            }, zoneProps);
            return (returnValue && typeof returnValue.then === 'function' ?
                DexiePromise.resolve(returnValue).then(x => trans.active ?
                    x
                    : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")))
                : promiseFollowed.then(() => returnValue)).then(x => {
                if (parentTransaction)
                    trans._resolve();
                return trans._completion.then(() => x);
            }).catch(e => {
                trans._reject(e);
                return rejection(e);
            });
        });
    }

    function pad(a, value, count) {
        const result = isArray(a) ? a.slice() : [a];
        for (let i = 0; i < count; ++i)
            result.push(value);
        return result;
    }
    function createVirtualIndexMiddleware(down) {
        return {
            ...down,
            table(tableName) {
                const table = down.table(tableName);
                const { schema } = table;
                const indexLookup = {};
                const allVirtualIndexes = [];
                function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
                    const keyPathAlias = getKeyPathAlias(keyPath);
                    const indexList = (indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || []);
                    const keyLength = keyPath == null ? 0 : typeof keyPath === 'string' ? 1 : keyPath.length;
                    const isVirtual = keyTail > 0;
                    const virtualIndex = {
                        ...lowLevelIndex,
                        isVirtual,
                        keyTail,
                        keyLength,
                        extractKey: getKeyExtractor(keyPath),
                        unique: !isVirtual && lowLevelIndex.unique
                    };
                    indexList.push(virtualIndex);
                    if (!virtualIndex.isPrimaryKey) {
                        allVirtualIndexes.push(virtualIndex);
                    }
                    if (keyLength > 1) {
                        const virtualKeyPath = keyLength === 2 ?
                            keyPath[0] :
                            keyPath.slice(0, keyLength - 1);
                        addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
                    }
                    indexList.sort((a, b) => a.keyTail - b.keyTail);
                    return virtualIndex;
                }
                const primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
                indexLookup[":id"] = [primaryKey];
                for (const index of schema.indexes) {
                    addVirtualIndexes(index.keyPath, 0, index);
                }
                function findBestIndex(keyPath) {
                    const result = indexLookup[getKeyPathAlias(keyPath)];
                    return result && result[0];
                }
                function translateRange(range, keyTail) {
                    return {
                        type: range.type === 1  ?
                            2  :
                            range.type,
                        lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
                        lowerOpen: true,
                        upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
                        upperOpen: true
                    };
                }
                function translateRequest(req) {
                    const index = req.query.index;
                    return index.isVirtual ? {
                        ...req,
                        query: {
                            index,
                            range: translateRange(req.query.range, index.keyTail)
                        }
                    } : req;
                }
                const result = {
                    ...table,
                    schema: {
                        ...schema,
                        primaryKey,
                        indexes: allVirtualIndexes,
                        getIndexByKeyPath: findBestIndex
                    },
                    count(req) {
                        return table.count(translateRequest(req));
                    },
                    query(req) {
                        return table.query(translateRequest(req));
                    },
                    openCursor(req) {
                        const { keyTail, isVirtual, keyLength } = req.query.index;
                        if (!isVirtual)
                            return table.openCursor(req);
                        function createVirtualCursor(cursor) {
                            function _continue(key) {
                                key != null ?
                                    cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) :
                                    req.unique ?
                                        cursor.continue(cursor.key.slice(0, keyLength)
                                            .concat(req.reverse
                                            ? down.MIN_KEY
                                            : down.MAX_KEY, keyTail)) :
                                        cursor.continue();
                            }
                            const virtualCursor = Object.create(cursor, {
                                continue: { value: _continue },
                                continuePrimaryKey: {
                                    value(key, primaryKey) {
                                        cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey);
                                    }
                                },
                                primaryKey: {
                                    get() {
                                        return cursor.primaryKey;
                                    }
                                },
                                key: {
                                    get() {
                                        const key = cursor.key;
                                        return keyLength === 1 ?
                                            key[0] :
                                            key.slice(0, keyLength);
                                    }
                                },
                                value: {
                                    get() {
                                        return cursor.value;
                                    }
                                }
                            });
                            return virtualCursor;
                        }
                        return table.openCursor(translateRequest(req))
                            .then(cursor => cursor && createVirtualCursor(cursor));
                    }
                };
                return result;
            }
        };
    }
    const virtualIndexMiddleware = {
        stack: "dbcore",
        name: "VirtualIndexMiddleware",
        level: 1,
        create: createVirtualIndexMiddleware
    };

    function getObjectDiff(a, b, rv, prfx) {
        rv = rv || {};
        prfx = prfx || '';
        keys(a).forEach((prop) => {
            if (!hasOwn(b, prop)) {
                rv[prfx + prop] = undefined;
            }
            else {
                var ap = a[prop], bp = b[prop];
                if (typeof ap === 'object' && typeof bp === 'object' && ap && bp) {
                    const apTypeName = toStringTag(ap);
                    const bpTypeName = toStringTag(bp);
                    if (apTypeName !== bpTypeName) {
                        rv[prfx + prop] = b[prop];
                    }
                    else if (apTypeName === 'Object') {
                        getObjectDiff(ap, bp, rv, prfx + prop + '.');
                    }
                    else if (ap !== bp) {
                        rv[prfx + prop] = b[prop];
                    }
                }
                else if (ap !== bp)
                    rv[prfx + prop] = b[prop];
            }
        });
        keys(b).forEach((prop) => {
            if (!hasOwn(a, prop)) {
                rv[prfx + prop] = b[prop];
            }
        });
        return rv;
    }

    function getEffectiveKeys(primaryKey, req) {
        if (req.type === 'delete')
            return req.keys;
        return req.keys || req.values.map(primaryKey.extractKey);
    }

    const hooksMiddleware = {
        stack: "dbcore",
        name: "HooksMiddleware",
        level: 2,
        create: (downCore) => ({
            ...downCore,
            table(tableName) {
                const downTable = downCore.table(tableName);
                const { primaryKey } = downTable.schema;
                const tableMiddleware = {
                    ...downTable,
                    mutate(req) {
                        const dxTrans = PSD.trans;
                        const { deleting, creating, updating } = dxTrans.table(tableName).hook;
                        switch (req.type) {
                            case 'add':
                                if (creating.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', () => addPutOrDelete(req), true);
                            case 'put':
                                if (creating.fire === nop && updating.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', () => addPutOrDelete(req), true);
                            case 'delete':
                                if (deleting.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', () => addPutOrDelete(req), true);
                            case 'deleteRange':
                                if (deleting.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', () => deleteRange(req), true);
                        }
                        return downTable.mutate(req);
                        function addPutOrDelete(req) {
                            const dxTrans = PSD.trans;
                            const keys = req.keys || getEffectiveKeys(primaryKey, req);
                            if (!keys)
                                throw new Error("Keys missing");
                            req = req.type === 'add' || req.type === 'put' ?
                                { ...req, keys } :
                                { ...req };
                            if (req.type !== 'delete')
                                req.values = [...req.values];
                            if (req.keys)
                                req.keys = [...req.keys];
                            return getExistingValues(downTable, req, keys).then(existingValues => {
                                const contexts = keys.map((key, i) => {
                                    const existingValue = existingValues[i];
                                    const ctx = { onerror: null, onsuccess: null };
                                    if (req.type === 'delete') {
                                        deleting.fire.call(ctx, key, existingValue, dxTrans);
                                    }
                                    else if (req.type === 'add' || existingValue === undefined) {
                                        const generatedPrimaryKey = creating.fire.call(ctx, key, req.values[i], dxTrans);
                                        if (key == null && generatedPrimaryKey != null) {
                                            key = generatedPrimaryKey;
                                            req.keys[i] = key;
                                            if (!primaryKey.outbound) {
                                                setByKeyPath(req.values[i], primaryKey.keyPath, key);
                                            }
                                        }
                                    }
                                    else {
                                        const objectDiff = getObjectDiff(existingValue, req.values[i]);
                                        const additionalChanges = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans);
                                        if (additionalChanges) {
                                            const requestedValue = req.values[i];
                                            Object.keys(additionalChanges).forEach(keyPath => {
                                                if (hasOwn(requestedValue, keyPath)) {
                                                    requestedValue[keyPath] = additionalChanges[keyPath];
                                                }
                                                else {
                                                    setByKeyPath(requestedValue, keyPath, additionalChanges[keyPath]);
                                                }
                                            });
                                        }
                                    }
                                    return ctx;
                                });
                                return downTable.mutate(req).then(({ failures, results, numFailures, lastResult }) => {
                                    for (let i = 0; i < keys.length; ++i) {
                                        const primKey = results ? results[i] : keys[i];
                                        const ctx = contexts[i];
                                        if (primKey == null) {
                                            ctx.onerror && ctx.onerror(failures[i]);
                                        }
                                        else {
                                            ctx.onsuccess && ctx.onsuccess(req.type === 'put' && existingValues[i] ?
                                                req.values[i] :
                                                primKey
                                            );
                                        }
                                    }
                                    return { failures, results, numFailures, lastResult };
                                }).catch(error => {
                                    contexts.forEach(ctx => ctx.onerror && ctx.onerror(error));
                                    return Promise.reject(error);
                                });
                            });
                        }
                        function deleteRange(req) {
                            return deleteNextChunk(req.trans, req.range, 10000);
                        }
                        function deleteNextChunk(trans, range, limit) {
                            return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit })
                                .then(({ result }) => {
                                return addPutOrDelete({ type: 'delete', keys: result, trans }).then(res => {
                                    if (res.numFailures > 0)
                                        return Promise.reject(res.failures[0]);
                                    if (result.length < limit) {
                                        return { failures: [], numFailures: 0, lastResult: undefined };
                                    }
                                    else {
                                        return deleteNextChunk(trans, { ...range, lower: result[result.length - 1], lowerOpen: true }, limit);
                                    }
                                });
                            });
                        }
                    }
                };
                return tableMiddleware;
            },
        })
    };
    function getExistingValues(table, req, effectiveKeys) {
        return req.type === "add"
            ? Promise.resolve([])
            : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
    }

    function getFromTransactionCache(keys, cache, clone) {
        try {
            if (!cache)
                return null;
            if (cache.keys.length < keys.length)
                return null;
            const result = [];
            for (let i = 0, j = 0; i < cache.keys.length && j < keys.length; ++i) {
                if (cmp(cache.keys[i], keys[j]) !== 0)
                    continue;
                result.push(clone ? deepClone(cache.values[i]) : cache.values[i]);
                ++j;
            }
            return result.length === keys.length ? result : null;
        }
        catch (_a) {
            return null;
        }
    }
    const cacheExistingValuesMiddleware = {
        stack: "dbcore",
        level: -1,
        create: (core) => {
            return {
                table: (tableName) => {
                    const table = core.table(tableName);
                    return {
                        ...table,
                        getMany: (req) => {
                            if (!req.cache) {
                                return table.getMany(req);
                            }
                            const cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
                            if (cachedResult) {
                                return DexiePromise.resolve(cachedResult);
                            }
                            return table.getMany(req).then((res) => {
                                req.trans["_cache"] = {
                                    keys: req.keys,
                                    values: req.cache === "clone" ? deepClone(res) : res,
                                };
                                return res;
                            });
                        },
                        mutate: (req) => {
                            if (req.type !== "add")
                                req.trans["_cache"] = null;
                            return table.mutate(req);
                        },
                    };
                },
            };
        },
    };

    function isEmptyRange(node) {
        return !("from" in node);
    }
    const RangeSet = function (fromOrTree, to) {
        if (this) {
            extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
        }
        else {
            const rv = new RangeSet();
            if (fromOrTree && ("d" in fromOrTree)) {
                extend(rv, fromOrTree);
            }
            return rv;
        }
    };
    props(RangeSet.prototype, {
        add(rangeSet) {
            mergeRanges(this, rangeSet);
            return this;
        },
        addKey(key) {
            addRange(this, key, key);
            return this;
        },
        addKeys(keys) {
            keys.forEach(key => addRange(this, key, key));
            return this;
        },
        [iteratorSymbol]() {
            return getRangeSetIterator(this);
        }
    });
    function addRange(target, from, to) {
        const diff = cmp(from, to);
        if (isNaN(diff))
            return;
        if (diff > 0)
            throw RangeError();
        if (isEmptyRange(target))
            return extend(target, { from, to, d: 1 });
        const left = target.l;
        const right = target.r;
        if (cmp(to, target.from) < 0) {
            left
                ? addRange(left, from, to)
                : (target.l = { from, to, d: 1, l: null, r: null });
            return rebalance(target);
        }
        if (cmp(from, target.to) > 0) {
            right
                ? addRange(right, from, to)
                : (target.r = { from, to, d: 1, l: null, r: null });
            return rebalance(target);
        }
        if (cmp(from, target.from) < 0) {
            target.from = from;
            target.l = null;
            target.d = right ? right.d + 1 : 1;
        }
        if (cmp(to, target.to) > 0) {
            target.to = to;
            target.r = null;
            target.d = target.l ? target.l.d + 1 : 1;
        }
        const rightWasCutOff = !target.r;
        if (left && !target.l) {
            mergeRanges(target, left);
        }
        if (right && rightWasCutOff) {
            mergeRanges(target, right);
        }
    }
    function mergeRanges(target, newSet) {
        function _addRangeSet(target, { from, to, l, r }) {
            addRange(target, from, to);
            if (l)
                _addRangeSet(target, l);
            if (r)
                _addRangeSet(target, r);
        }
        if (!isEmptyRange(newSet))
            _addRangeSet(target, newSet);
    }
    function rangesOverlap(rangeSet1, rangeSet2) {
        const i1 = getRangeSetIterator(rangeSet2);
        let nextResult1 = i1.next();
        if (nextResult1.done)
            return false;
        let a = nextResult1.value;
        const i2 = getRangeSetIterator(rangeSet1);
        let nextResult2 = i2.next(a.from);
        let b = nextResult2.value;
        while (!nextResult1.done && !nextResult2.done) {
            if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0)
                return true;
            cmp(a.from, b.from) < 0
                ? (a = (nextResult1 = i1.next(b.from)).value)
                : (b = (nextResult2 = i2.next(a.from)).value);
        }
        return false;
    }
    function getRangeSetIterator(node) {
        let state = isEmptyRange(node) ? null : { s: 0, n: node };
        return {
            next(key) {
                const keyProvided = arguments.length > 0;
                while (state) {
                    switch (state.s) {
                        case 0:
                            state.s = 1;
                            if (keyProvided) {
                                while (state.n.l && cmp(key, state.n.from) < 0)
                                    state = { up: state, n: state.n.l, s: 1 };
                            }
                            else {
                                while (state.n.l)
                                    state = { up: state, n: state.n.l, s: 1 };
                            }
                        case 1:
                            state.s = 2;
                            if (!keyProvided || cmp(key, state.n.to) <= 0)
                                return { value: state.n, done: false };
                        case 2:
                            if (state.n.r) {
                                state.s = 3;
                                state = { up: state, n: state.n.r, s: 0 };
                                continue;
                            }
                        case 3:
                            state = state.up;
                    }
                }
                return { done: true };
            },
        };
    }
    function rebalance(target) {
        var _a, _b;
        const diff = (((_a = target.r) === null || _a === void 0 ? void 0 : _a.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
        const r = diff > 1 ? "r" : diff < -1 ? "l" : "";
        if (r) {
            const l = r === "r" ? "l" : "r";
            const rootClone = { ...target };
            const oldRootRight = target[r];
            target.from = oldRootRight.from;
            target.to = oldRootRight.to;
            target[r] = oldRootRight[r];
            rootClone[r] = oldRootRight[l];
            target[l] = rootClone;
            rootClone.d = computeDepth(rootClone);
        }
        target.d = computeDepth(target);
    }
    function computeDepth({ r, l }) {
        return (r ? (l ? Math.max(r.d, l.d) : r.d) : l ? l.d : 0) + 1;
    }

    const observabilityMiddleware = {
        stack: "dbcore",
        level: 0,
        create: (core) => {
            const dbName = core.schema.name;
            const FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
            return {
                ...core,
                table: (tableName) => {
                    const table = core.table(tableName);
                    const { schema } = table;
                    const { primaryKey } = schema;
                    const { extractKey, outbound } = primaryKey;
                    const tableClone = {
                        ...table,
                        mutate: (req) => {
                            const trans = req.trans;
                            const mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
                            const getRangeSet = (indexName) => {
                                const part = `idb://${dbName}/${tableName}/${indexName}`;
                                return (mutatedParts[part] ||
                                    (mutatedParts[part] = new RangeSet()));
                            };
                            const pkRangeSet = getRangeSet("");
                            const delsRangeSet = getRangeSet(":dels");
                            const { type } = req;
                            let [keys, newObjs] = req.type === "deleteRange"
                                ? [req.range]
                                : req.type === "delete"
                                    ? [req.keys]
                                    : req.values.length < 50
                                        ? [[], req.values]
                                        : [];
                            const oldCache = req.trans["_cache"];
                            return table.mutate(req).then((res) => {
                                if (isArray(keys)) {
                                    if (type !== "delete")
                                        keys = res.results;
                                    pkRangeSet.addKeys(keys);
                                    const oldObjs = getFromTransactionCache(keys, oldCache);
                                    if (!oldObjs && type !== "add") {
                                        delsRangeSet.addKeys(keys);
                                    }
                                    if (oldObjs || newObjs) {
                                        trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                                    }
                                }
                                else if (keys) {
                                    const range = { from: keys.lower, to: keys.upper };
                                    delsRangeSet.add(range);
                                    pkRangeSet.add(range);
                                }
                                else {
                                    pkRangeSet.add(FULL_RANGE);
                                    delsRangeSet.add(FULL_RANGE);
                                    schema.indexes.forEach(idx => getRangeSet(idx.name).add(FULL_RANGE));
                                }
                                return res;
                            });
                        },
                    };
                    const getRange = ({ query: { index, range }, }) => {
                        var _a, _b;
                        return [
                            index,
                            new RangeSet((_a = range.lower) !== null && _a !== void 0 ? _a : core.MIN_KEY, (_b = range.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY),
                        ];
                    };
                    const readSubscribers = {
                        get: (req) => [primaryKey, new RangeSet(req.key)],
                        getMany: (req) => [primaryKey, new RangeSet().addKeys(req.keys)],
                        count: getRange,
                        query: getRange,
                        openCursor: getRange,
                    };
                    keys(readSubscribers).forEach(method => {
                        tableClone[method] = function (req) {
                            const { subscr } = PSD;
                            if (subscr) {
                                const getRangeSet = (indexName) => {
                                    const part = `idb://${dbName}/${tableName}/${indexName}`;
                                    return (subscr[part] ||
                                        (subscr[part] = new RangeSet()));
                                };
                                const pkRangeSet = getRangeSet("");
                                const delsRangeSet = getRangeSet(":dels");
                                const [queriedIndex, queriedRanges] = readSubscribers[method](req);
                                getRangeSet(queriedIndex.name || "").add(queriedRanges);
                                if (!queriedIndex.isPrimaryKey) {
                                    if (method === "count") {
                                        delsRangeSet.add(FULL_RANGE);
                                    }
                                    else {
                                        const keysPromise = method === "query" &&
                                            outbound &&
                                            req.values &&
                                            table.query({
                                                ...req,
                                                values: false,
                                            });
                                        return table[method].apply(this, arguments).then((res) => {
                                            if (method === "query") {
                                                if (outbound && req.values) {
                                                    return keysPromise.then(({ result: resultingKeys }) => {
                                                        pkRangeSet.addKeys(resultingKeys);
                                                        return res;
                                                    });
                                                }
                                                const pKeys = req.values
                                                    ? res.result.map(extractKey)
                                                    : res.result;
                                                if (req.values) {
                                                    pkRangeSet.addKeys(pKeys);
                                                }
                                                else {
                                                    delsRangeSet.addKeys(pKeys);
                                                }
                                            }
                                            else if (method === "openCursor") {
                                                const cursor = res;
                                                const wantValues = req.values;
                                                return (cursor &&
                                                    Object.create(cursor, {
                                                        key: {
                                                            get() {
                                                                delsRangeSet.addKey(cursor.primaryKey);
                                                                return cursor.key;
                                                            },
                                                        },
                                                        primaryKey: {
                                                            get() {
                                                                const pkey = cursor.primaryKey;
                                                                delsRangeSet.addKey(pkey);
                                                                return pkey;
                                                            },
                                                        },
                                                        value: {
                                                            get() {
                                                                wantValues && pkRangeSet.addKey(cursor.primaryKey);
                                                                return cursor.value;
                                                            },
                                                        },
                                                    }));
                                            }
                                            return res;
                                        });
                                    }
                                }
                            }
                            return table[method].apply(this, arguments);
                        };
                    });
                    return tableClone;
                },
            };
        },
    };
    function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
        function addAffectedIndex(ix) {
            const rangeSet = getRangeSet(ix.name || "");
            function extractKey(obj) {
                return obj != null ? ix.extractKey(obj) : null;
            }
            const addKeyOrKeys = (key) => ix.multiEntry && isArray(key)
                ? key.forEach(key => rangeSet.addKey(key))
                : rangeSet.addKey(key);
            (oldObjs || newObjs).forEach((_, i) => {
                const oldKey = oldObjs && extractKey(oldObjs[i]);
                const newKey = newObjs && extractKey(newObjs[i]);
                if (cmp(oldKey, newKey) !== 0) {
                    if (oldKey != null)
                        addKeyOrKeys(oldKey);
                    if (newKey != null)
                        addKeyOrKeys(newKey);
                }
            });
        }
        schema.indexes.forEach(addAffectedIndex);
    }

    class Dexie$1 {
        constructor(name, options) {
            this._middlewares = {};
            this.verno = 0;
            const deps = Dexie$1.dependencies;
            this._options = options = {
                addons: Dexie$1.addons,
                autoOpen: true,
                indexedDB: deps.indexedDB,
                IDBKeyRange: deps.IDBKeyRange,
                ...options
            };
            this._deps = {
                indexedDB: options.indexedDB,
                IDBKeyRange: options.IDBKeyRange
            };
            const { addons, } = options;
            this._dbSchema = {};
            this._versions = [];
            this._storeNames = [];
            this._allTables = {};
            this.idbdb = null;
            this._novip = this;
            const state = {
                dbOpenError: null,
                isBeingOpened: false,
                onReadyBeingFired: null,
                openComplete: false,
                dbReadyResolve: nop,
                dbReadyPromise: null,
                cancelOpen: nop,
                openCanceller: null,
                autoSchema: true,
                PR1398_maxLoop: 3
            };
            state.dbReadyPromise = new DexiePromise(resolve => {
                state.dbReadyResolve = resolve;
            });
            state.openCanceller = new DexiePromise((_, reject) => {
                state.cancelOpen = reject;
            });
            this._state = state;
            this.name = name;
            this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
            this.on.ready.subscribe = override(this.on.ready.subscribe, subscribe => {
                return (subscriber, bSticky) => {
                    Dexie$1.vip(() => {
                        const state = this._state;
                        if (state.openComplete) {
                            if (!state.dbOpenError)
                                DexiePromise.resolve().then(subscriber);
                            if (bSticky)
                                subscribe(subscriber);
                        }
                        else if (state.onReadyBeingFired) {
                            state.onReadyBeingFired.push(subscriber);
                            if (bSticky)
                                subscribe(subscriber);
                        }
                        else {
                            subscribe(subscriber);
                            const db = this;
                            if (!bSticky)
                                subscribe(function unsubscribe() {
                                    db.on.ready.unsubscribe(subscriber);
                                    db.on.ready.unsubscribe(unsubscribe);
                                });
                        }
                    });
                };
            });
            this.Collection = createCollectionConstructor(this);
            this.Table = createTableConstructor(this);
            this.Transaction = createTransactionConstructor(this);
            this.Version = createVersionConstructor(this);
            this.WhereClause = createWhereClauseConstructor(this);
            this.on("versionchange", ev => {
                if (ev.newVersion > 0)
                    console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`);
                else
                    console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`);
                this.close();
            });
            this.on("blocked", ev => {
                if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                    console.warn(`Dexie.delete('${this.name}') was blocked`);
                else
                    console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${ev.oldVersion / 10}`);
            });
            this._maxKey = getMaxKey(options.IDBKeyRange);
            this._createTransaction = (mode, storeNames, dbschema, parentTransaction) => new this.Transaction(mode, storeNames, dbschema, this._options.chromeTransactionDurability, parentTransaction);
            this._fireOnBlocked = ev => {
                this.on("blocked").fire(ev);
                connections
                    .filter(c => c.name === this.name && c !== this && !c._state.vcFired)
                    .map(c => c.on("versionchange").fire(ev));
            };
            this.use(virtualIndexMiddleware);
            this.use(hooksMiddleware);
            this.use(observabilityMiddleware);
            this.use(cacheExistingValuesMiddleware);
            this.vip = Object.create(this, { _vip: { value: true } });
            addons.forEach(addon => addon(this));
        }
        version(versionNumber) {
            if (isNaN(versionNumber) || versionNumber < 0.1)
                throw new exceptions.Type(`Given version is not a positive number`);
            versionNumber = Math.round(versionNumber * 10) / 10;
            if (this.idbdb || this._state.isBeingOpened)
                throw new exceptions.Schema("Cannot add version when database is open");
            this.verno = Math.max(this.verno, versionNumber);
            const versions = this._versions;
            var versionInstance = versions.filter(v => v._cfg.version === versionNumber)[0];
            if (versionInstance)
                return versionInstance;
            versionInstance = new this.Version(versionNumber);
            versions.push(versionInstance);
            versions.sort(lowerVersionFirst);
            versionInstance.stores({});
            this._state.autoSchema = false;
            return versionInstance;
        }
        _whenReady(fn) {
            return (this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip)) ? fn() : new DexiePromise((resolve, reject) => {
                if (this._state.openComplete) {
                    return reject(new exceptions.DatabaseClosed(this._state.dbOpenError));
                }
                if (!this._state.isBeingOpened) {
                    if (!this._options.autoOpen) {
                        reject(new exceptions.DatabaseClosed());
                        return;
                    }
                    this.open().catch(nop);
                }
                this._state.dbReadyPromise.then(resolve, reject);
            }).then(fn);
        }
        use({ stack, create, level, name }) {
            if (name)
                this.unuse({ stack, name });
            const middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
            middlewares.push({ stack, create, level: level == null ? 10 : level, name });
            middlewares.sort((a, b) => a.level - b.level);
            return this;
        }
        unuse({ stack, name, create }) {
            if (stack && this._middlewares[stack]) {
                this._middlewares[stack] = this._middlewares[stack].filter(mw => create ? mw.create !== create :
                    name ? mw.name !== name :
                        false);
            }
            return this;
        }
        open() {
            return dexieOpen(this);
        }
        _close() {
            const state = this._state;
            const idx = connections.indexOf(this);
            if (idx >= 0)
                connections.splice(idx, 1);
            if (this.idbdb) {
                try {
                    this.idbdb.close();
                }
                catch (e) { }
                this._novip.idbdb = null;
            }
            state.dbReadyPromise = new DexiePromise(resolve => {
                state.dbReadyResolve = resolve;
            });
            state.openCanceller = new DexiePromise((_, reject) => {
                state.cancelOpen = reject;
            });
        }
        close() {
            this._close();
            const state = this._state;
            this._options.autoOpen = false;
            state.dbOpenError = new exceptions.DatabaseClosed();
            if (state.isBeingOpened)
                state.cancelOpen(state.dbOpenError);
        }
        delete() {
            const hasArguments = arguments.length > 0;
            const state = this._state;
            return new DexiePromise((resolve, reject) => {
                const doDelete = () => {
                    this.close();
                    var req = this._deps.indexedDB.deleteDatabase(this.name);
                    req.onsuccess = wrap(() => {
                        _onDatabaseDeleted(this._deps, this.name);
                        resolve();
                    });
                    req.onerror = eventRejectHandler(reject);
                    req.onblocked = this._fireOnBlocked;
                };
                if (hasArguments)
                    throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
                if (state.isBeingOpened) {
                    state.dbReadyPromise.then(doDelete);
                }
                else {
                    doDelete();
                }
            });
        }
        backendDB() {
            return this.idbdb;
        }
        isOpen() {
            return this.idbdb !== null;
        }
        hasBeenClosed() {
            const dbOpenError = this._state.dbOpenError;
            return dbOpenError && (dbOpenError.name === 'DatabaseClosed');
        }
        hasFailed() {
            return this._state.dbOpenError !== null;
        }
        dynamicallyOpened() {
            return this._state.autoSchema;
        }
        get tables() {
            return keys(this._allTables).map(name => this._allTables[name]);
        }
        transaction() {
            const args = extractTransactionArgs.apply(this, arguments);
            return this._transaction.apply(this, args);
        }
        _transaction(mode, tables, scopeFunc) {
            let parentTransaction = PSD.trans;
            if (!parentTransaction || parentTransaction.db !== this || mode.indexOf('!') !== -1)
                parentTransaction = null;
            const onlyIfCompatible = mode.indexOf('?') !== -1;
            mode = mode.replace('!', '').replace('?', '');
            let idbMode, storeNames;
            try {
                storeNames = tables.map(table => {
                    var storeName = table instanceof this.Table ? table.name : table;
                    if (typeof storeName !== 'string')
                        throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                    return storeName;
                });
                if (mode == "r" || mode === READONLY)
                    idbMode = READONLY;
                else if (mode == "rw" || mode == READWRITE)
                    idbMode = READWRITE;
                else
                    throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
                if (parentTransaction) {
                    if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                        if (onlyIfCompatible) {
                            parentTransaction = null;
                        }
                        else
                            throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                    }
                    if (parentTransaction) {
                        storeNames.forEach(storeName => {
                            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                                if (onlyIfCompatible) {
                                    parentTransaction = null;
                                }
                                else
                                    throw new exceptions.SubTransaction("Table " + storeName +
                                        " not included in parent transaction.");
                            }
                        });
                    }
                    if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                        parentTransaction = null;
                    }
                }
            }
            catch (e) {
                return parentTransaction ?
                    parentTransaction._promise(null, (_, reject) => { reject(e); }) :
                    rejection(e);
            }
            const enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
            return (parentTransaction ?
                parentTransaction._promise(idbMode, enterTransaction, "lock") :
                PSD.trans ?
                    usePSD(PSD.transless, () => this._whenReady(enterTransaction)) :
                    this._whenReady(enterTransaction));
        }
        table(tableName) {
            if (!hasOwn(this._allTables, tableName)) {
                throw new exceptions.InvalidTable(`Table ${tableName} does not exist`);
            }
            return this._allTables[tableName];
        }
    }

    const symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol
        ? Symbol.observable
        : "@@observable";
    class Observable {
        constructor(subscribe) {
            this._subscribe = subscribe;
        }
        subscribe(x, error, complete) {
            return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
        }
        [symbolObservable]() {
            return this;
        }
    }

    function extendObservabilitySet(target, newSet) {
        keys(newSet).forEach(part => {
            const rangeSet = target[part] || (target[part] = new RangeSet());
            mergeRanges(rangeSet, newSet[part]);
        });
        return target;
    }

    function liveQuery(querier) {
        return new Observable((observer) => {
            const scopeFuncIsAsync = isAsyncFunction(querier);
            function execute(subscr) {
                if (scopeFuncIsAsync) {
                    incrementExpectedAwaits();
                }
                const exec = () => newScope(querier, { subscr, trans: null });
                const rv = PSD.trans
                    ?
                        usePSD(PSD.transless, exec)
                    : exec();
                if (scopeFuncIsAsync) {
                    rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
                }
                return rv;
            }
            let closed = false;
            let accumMuts = {};
            let currentObs = {};
            const subscription = {
                get closed() {
                    return closed;
                },
                unsubscribe: () => {
                    closed = true;
                    globalEvents.storagemutated.unsubscribe(mutationListener);
                },
            };
            observer.start && observer.start(subscription);
            let querying = false, startedListening = false;
            function shouldNotify() {
                return keys(currentObs).some((key) => accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]));
            }
            const mutationListener = (parts) => {
                extendObservabilitySet(accumMuts, parts);
                if (shouldNotify()) {
                    doQuery();
                }
            };
            const doQuery = () => {
                if (querying || closed)
                    return;
                accumMuts = {};
                const subscr = {};
                const ret = execute(subscr);
                if (!startedListening) {
                    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
                    startedListening = true;
                }
                querying = true;
                Promise.resolve(ret).then((result) => {
                    querying = false;
                    if (closed)
                        return;
                    if (shouldNotify()) {
                        doQuery();
                    }
                    else {
                        accumMuts = {};
                        currentObs = subscr;
                        observer.next && observer.next(result);
                    }
                }, (err) => {
                    querying = false;
                    observer.error && observer.error(err);
                    subscription.unsubscribe();
                });
            };
            doQuery();
            return subscription;
        });
    }

    let domDeps;
    try {
        domDeps = {
            indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
            IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
        };
    }
    catch (e) {
        domDeps = { indexedDB: null, IDBKeyRange: null };
    }

    const Dexie = Dexie$1;
    props(Dexie, {
        ...fullNameExceptions,
        delete(databaseName) {
            const db = new Dexie(databaseName, { addons: [] });
            return db.delete();
        },
        exists(name) {
            return new Dexie(name, { addons: [] }).open().then(db => {
                db.close();
                return true;
            }).catch('NoSuchDatabaseError', () => false);
        },
        getDatabaseNames(cb) {
            try {
                return getDatabaseNames(Dexie.dependencies).then(cb);
            }
            catch (_a) {
                return rejection(new exceptions.MissingAPI());
            }
        },
        defineClass() {
            function Class(content) {
                extend(this, content);
            }
            return Class;
        },
        ignoreTransaction(scopeFunc) {
            return PSD.trans ?
                usePSD(PSD.transless, scopeFunc) :
                scopeFunc();
        },
        vip,
        async: function (generatorFn) {
            return function () {
                try {
                    var rv = awaitIterator(generatorFn.apply(this, arguments));
                    if (!rv || typeof rv.then !== 'function')
                        return DexiePromise.resolve(rv);
                    return rv;
                }
                catch (e) {
                    return rejection(e);
                }
            };
        },
        spawn: function (generatorFn, args, thiz) {
            try {
                var rv = awaitIterator(generatorFn.apply(thiz, args || []));
                if (!rv || typeof rv.then !== 'function')
                    return DexiePromise.resolve(rv);
                return rv;
            }
            catch (e) {
                return rejection(e);
            }
        },
        currentTransaction: {
            get: () => PSD.trans || null
        },
        waitFor: function (promiseOrFunction, optionalTimeout) {
            const promise = DexiePromise.resolve(typeof promiseOrFunction === 'function' ?
                Dexie.ignoreTransaction(promiseOrFunction) :
                promiseOrFunction)
                .timeout(optionalTimeout || 60000);
            return PSD.trans ?
                PSD.trans.waitFor(promise) :
                promise;
        },
        Promise: DexiePromise,
        debug: {
            get: () => debug,
            set: value => {
                setDebug(value, value === 'dexie' ? () => true : dexieStackFrameFilter);
            }
        },
        derive: derive,
        extend: extend,
        props: props,
        override: override,
        Events: Events,
        on: globalEvents,
        liveQuery,
        extendObservabilitySet,
        getByKeyPath: getByKeyPath,
        setByKeyPath: setByKeyPath,
        delByKeyPath: delByKeyPath,
        shallowClone: shallowClone,
        deepClone: deepClone,
        getObjectDiff: getObjectDiff,
        cmp,
        asap: asap$1,
        minKey: minKey,
        addons: [],
        connections: connections,
        errnames: errnames,
        dependencies: domDeps,
        semVer: DEXIE_VERSION,
        version: DEXIE_VERSION.split('.')
            .map(n => parseInt(n))
            .reduce((p, c, i) => p + (c / Math.pow(10, i * 2))),
    });
    Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);

    if (typeof dispatchEvent !== 'undefined' && typeof addEventListener !== 'undefined') {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, updatedParts => {
            if (!propagatingLocally) {
                let event;
                if (isIEOrEdge) {
                    event = document.createEvent('CustomEvent');
                    event.initCustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, true, true, updatedParts);
                }
                else {
                    event = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
                        detail: updatedParts
                    });
                }
                propagatingLocally = true;
                dispatchEvent(event);
                propagatingLocally = false;
            }
        });
        addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, ({ detail }) => {
            if (!propagatingLocally) {
                propagateLocally(detail);
            }
        });
    }
    function propagateLocally(updateParts) {
        let wasMe = propagatingLocally;
        try {
            propagatingLocally = true;
            globalEvents.storagemutated.fire(updateParts);
        }
        finally {
            propagatingLocally = wasMe;
        }
    }
    let propagatingLocally = false;

    if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
        if (typeof bc.unref === 'function') {
            bc.unref();
        }
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
            if (!propagatingLocally) {
                bc.postMessage(changedParts);
            }
        });
        bc.onmessage = (ev) => {
            if (ev.data)
                propagateLocally(ev.data);
        };
    }
    else if (typeof self !== 'undefined' && typeof navigator !== 'undefined') {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
            try {
                if (!propagatingLocally) {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem(STORAGE_MUTATED_DOM_EVENT_NAME, JSON.stringify({
                            trig: Math.random(),
                            changedParts,
                        }));
                    }
                    if (typeof self['clients'] === 'object') {
                        [...self['clients'].matchAll({ includeUncontrolled: true })].forEach((client) => client.postMessage({
                            type: STORAGE_MUTATED_DOM_EVENT_NAME,
                            changedParts,
                        }));
                    }
                }
            }
            catch (_a) { }
        });
        if (typeof addEventListener !== 'undefined') {
            addEventListener('storage', (ev) => {
                if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
                    const data = JSON.parse(ev.newValue);
                    if (data)
                        propagateLocally(data.changedParts);
                }
            });
        }
        const swContainer = self.document && navigator.serviceWorker;
        if (swContainer) {
            swContainer.addEventListener('message', propagateMessageLocally);
        }
    }
    function propagateMessageLocally({ data }) {
        if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
            propagateLocally(data.changedParts);
        }
    }

    DexiePromise.rejectionMapper = mapError;
    setDebug(debug, dexieStackFrameFilter);

    /* src\App.svelte generated by Svelte v3.58.0 */

    // (16:4) <Route path="/">
    function create_default_slot_2(ctx) {
    	let landing;
    	let current;

    	landing = new Landing({
    			props: { db: /*db*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(landing.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(landing, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(landing.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(landing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(landing, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(16:4) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:4) <Route path="chat">
    function create_default_slot_1(ctx) {
    	let chat;
    	let current;
    	chat = new Chat({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(chat.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chat, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(17:4) <Route path=\\\"chat\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:0) <Router {url}>
    function create_default_slot(ctx) {
    	let route0;
    	let t;
    	let route1;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "chat",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(15:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
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
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
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
    	let { url = "" } = $$props;
    	const db = new Dexie$1("CryptoChat");

    	db.version(1).stores({
    		history: "++id, username, key, timestamp"
    	});

    	db.open().catch(function (e) {
    		alert("Open failed: " + e);
    	});

    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Landing,
    		Chat,
    		url,
    		Dexie: Dexie$1,
    		db
    	});

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url, db];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
