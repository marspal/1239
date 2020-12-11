/**
 * @file cookie测试
 * @author andyxu
 */

import http from 'http';
import Cookies from '../../koa/cookies';
import request from 'supertest';

describe('new Cookies.Cookie(name, val, [opt])', () => {
    describe('exception', () => {
        it('should have correct constructor', () => {
            const cookie = new Cookies.Cookie('foo', 'bar');
            expect(cookie.constructor).toBe(Cookies.Cookie);
        });
        it('should throw on invalid name', () => {
            let test = () => new Cookies.Cookie('foo\n', 'bar');
            expect(test).toThrowError(/argument name is invalid/);
        });
        it('should throw on invalid value', () => {
            let test = () => new Cookies.Cookie('foo', 'bar\n');
            expect(test).toThrowError(/argument value is invalid/);
        });
        it('should throw on invalid path', () => {
            let test = () => new Cookies.Cookie('foo', 'bar', {path: '/\n'});
            expect(test).toThrowError(/option path is invalid/);
        });
        it('should throw on invalide domain', () => {
            let test = () => new Cookies.Cookie('foo', 'bar', {domain: 'example.com\n'});
            expect(test).toThrowError(/option domain is invalid/);
        });
        it('should throw on invalide sameSite', () => {
            let test = () => new Cookies.Cookie('foo', 'bar', {sameSite: 'aaa'});
            expect(test).toThrowError(/option sameSite is invalid/);
        });
    });
    describe('options', () => {
        it('should set the .maxAge property', () => {
            const cookie = new Cookies.Cookie('name', 'value', {maxage: 865400});
            expect(cookie.maxAge).toBe(865400);

        });
        it('should set the .maxage property', () => {
            const cookie = new Cookies.Cookie('name', 'value', {maxage: 865400});
            expect(cookie.maxage).toBe(865400);
        });
        it('should set the .maxAge property', () => {
            const cookie = new Cookies.Cookie('name', 'value', {maxAge: 865400});
            expect(cookie.maxAge).toBe(865400);

        });
        it('should set the .maxage property', () => {
            const cookie = new Cookies.Cookie('name', 'value', {maxAge: 865400});
            expect(cookie.maxage).toBe(865400);
        });
        it('should set the .sameSite property', () => {
            const cookie = new Cookies.Cookie('name', 'value', {sameSite: true});
            expect(cookie.sameSite).toBeTruthy();
        });
        it('should default to false', () => {
            const Cookie = new Cookies.Cookie('name', 'value');
            expect(Cookie.sameSite).toBeFalsy();
        });
        it('should throw on invalid sameSite', () => {
            const test = () => new Cookies.Cookie('name', 'value', {sameSite: 'foo'});
            expect(test).toThrowError(/option sameSite is invalid/);
        });
        it('should not set "sameSite" attribute in header', () => {
            const cookie = new Cookies.Cookie('name', 'value', {sameSite: false});
            expect(cookie.toHeader()).toBe('name=value; path=/; httponly');
        });
        it('should set "sameSite" attribute in header', () => {
            const cookie = new Cookies.Cookie('name', 'value', {sameSite: true});
            expect(cookie.toHeader()).toBe('name=value; path=/; samesite=strict; httponly');
        });
        it('should set "samesite=lax" attribute in header', () => {
            const cookie = new Cookies.Cookie('name', 'value', {sameSite: 'lax'});
            expect(cookie.toHeader()).toBe('name=value; path=/; samesite=lax; httponly');
        });
        it('should set "samesite=none" attribute in header', function () {
            const cookie = new Cookies.Cookie('foo', 'bar', {sameSite: 'none'});
            expect(cookie.toHeader()).toBe('foo=bar; path=/; samesite=none; httponly');
        });
        it('should set "samesite=strict" attribute in header', function () {
            const cookie = new Cookies.Cookie('foo', 'bar', {sameSite: 'strict'});
            expect(cookie.toHeader()).toBe('foo=bar; path=/; samesite=strict; httponly');
        });
        it('should set "samesite=strict" attribute in header', function () {
            const cookie = new Cookies.Cookie('foo', 'bar', {sameSite: 'STRICT'});
            expect(cookie.toHeader()).toBe('foo=bar; path=/; samesite=strict; httponly');
        });
    });
});

describe('new Cookies(req, res, [options])', () => {
    it('should create new cookies instance', function (done) {
        // todo
        assertServer(done, function (req, res) {

        });
    });
});

async function assertServer(done, test) {
    const server = http.createServer(function (req, res) {
        try {
            test(req, res);
            res.end('OK'); // ? 返回啥
        } catch (e){
            res.statusCode = 500;
            res.end(e.name + ":" + e.message);
        }
    });
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
    done();
}
