/**
 * LaunchScreen.js — Beautify Africa
 *
 * All 4 phase layers are mounted simultaneously as stacked absolute views.
 * Transitions are pure cross-fades via Animated.Value — zero blank screens.
 *
 * Phases:
 *  0  SPLASH  — Logo springs in, 3 staggered ripple rings pulse outward
 *  1  BRAND   — White bg cross-fades in, wordmark reveals with shimmer sweep
 *  2  HERO    — 3 cinematic slides, Ken Burns zoom, per-slide tagline slide-in
 *  3  CTA     — Bottom sheet springs up, content staggers in item by item
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radii } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// ─── Hero slide content ──────────────────────────────────────────────────────
const SLIDES = [
  {
    uri: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=90',
    label: '01',
    tagline: 'Discover Your\nEveryday Beauty.',
    sub: 'Skincare, Makeup, Hair & Fragrance',
  },
  {
    uri: 'https://images.unsplash.com/photo-1581182800629-7d90925ad072?auto=format&fit=crop&w=1200&q=90',
    label: '02',
    tagline: 'Top Global &\nLocal Brands.',
    sub: '100% Authentic Beauty Essentials',
  },
  {
    uri: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=90',
    label: '03',
    tagline: 'Fast Delivery\nAcross Africa.',
    sub: 'Delivered straight to your door',
  },
];

// ─── Easing curves ───────────────────────────────────────────────────────────
const EASE_OUT_QUART = Easing.bezier(0.25, 1, 0.5, 1);
const EASE_IN_OUT    = Easing.bezier(0.45, 0, 0.55, 1);

// ─── Utility: cross-fade between two Animated.Values ────────────────────────
function crossFade(outAnim, inAnim, duration = 480, cb) {
  Animated.parallel([
    Animated.timing(outAnim, { toValue: 0, duration, easing: EASE_IN_OUT, useNativeDriver: true }),
    Animated.timing(inAnim,  { toValue: 1, duration, easing: EASE_IN_OUT, useNativeDriver: true }),
  ]).start(cb);
}

// ─── Single Hero Slide ───────────────────────────────────────────────────────
function HeroSlide({ slide, visible, slideOpacity }) {
  const kenBurns   = useRef(new Animated.Value(1.12)).current;
  const taglineY   = useRef(new Animated.Value(28)).current;
  const taglineOp  = useRef(new Animated.Value(0)).current;
  const subY       = useRef(new Animated.Value(16)).current;
  const subOp      = useRef(new Animated.Value(0)).current;
  const labelOp    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset
      kenBurns.setValue(1.12);
      taglineY.setValue(28);
      taglineOp.setValue(0);
      subY.setValue(16);
      subOp.setValue(0);
      labelOp.setValue(0);

      Animated.sequence([
        // Ken Burns starts immediately
        Animated.timing(kenBurns, {
          toValue: 1,
          duration: 5500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();

      // Tagline staggers in after 320ms
      Animated.sequence([
        Animated.delay(320),
        Animated.parallel([
          Animated.timing(labelOp, { toValue: 0.7, duration: 420, useNativeDriver: true }),
          Animated.timing(taglineOp, { toValue: 1, duration: 560, easing: EASE_OUT_QUART, useNativeDriver: true }),
          Animated.timing(taglineY, { toValue: 0, duration: 560, easing: EASE_OUT_QUART, useNativeDriver: true }),
        ]),
        Animated.delay(80),
        Animated.parallel([
          Animated.timing(subOp, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(subY, { toValue: 0, duration: 420, easing: EASE_OUT_QUART, useNativeDriver: true }),
        ]),
      ]).start();
    } else {
      // Reset when hidden so next appearance is fresh
      kenBurns.setValue(1.12);
      taglineY.setValue(28);
      taglineOp.setValue(0);
      subY.setValue(16);
      subOp.setValue(0);
      labelOp.setValue(0);
    }
  }, [visible]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: slideOpacity }]}>
      <Animated.Image
        source={{ uri: slide.uri }}
        style={[styles.slideImage, { transform: [{ scale: kenBurns }] }]}
        resizeMode="cover"
      />
      {/* Multi-stop cinematic gradient */}
      <LinearGradient
        colors={[
          'rgba(28,25,23,0.55)',
          'rgba(28,25,23,0.08)',
          'rgba(28,25,23,0.08)',
          'rgba(28,25,23,0.80)',
        ]}
        locations={[0, 0.22, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Slide number */}
      <Animated.Text style={[styles.slideLabel, { opacity: labelOp }]}>
        {slide.label}
      </Animated.Text>
      {/* Decorative left edge bar */}
      <Animated.View style={[styles.slideEdgeBar, { opacity: taglineOp }]} />
      {/* Tagline */}
      <Animated.Text
        style={[
          styles.slideTagline,
          { opacity: taglineOp, transform: [{ translateY: taglineY }] },
        ]}
      >
        {slide.tagline}
      </Animated.Text>
      {/* Sub line */}
      <Animated.Text
        style={[
          styles.slideSub,
          { opacity: subOp, transform: [{ translateY: subY }] },
        ]}
      >
        {slide.sub}
      </Animated.Text>
    </Animated.View>
  );
}

// ─── Animated progress bar (replaces dots) ───────────────────────────────────
function ProgressBar({ index, total, progressAnim }) {
  return (
    <View style={styles.progressTrack}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={styles.progressSegment}>
          {i === index && (
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
              ]}
            />
          )}
          {i < index && <View style={[styles.progressFill, { width: '100%' }]} />}
        </View>
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════
export default function LaunchScreen() {
  const navigation = useNavigation();
  const [heroIndex, setHeroIndex] = useState(0);
  const [showCta, setShowCta]     = useState(false);

  // ── Layer opacities (all phases live simultaneously, no re-mount flashes)
  const splashOp = useRef(new Animated.Value(1)).current;
  const brandOp  = useRef(new Animated.Value(0)).current;
  const heroOp   = useRef(new Animated.Value(0)).current;

  // ── Splash internals
  const logoScale   = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const shimmerX    = useRef(new Animated.Value(-width * 0.5)).current;
  const ring1Scale  = useRef(new Animated.Value(1)).current;
  const ring1Op     = useRef(new Animated.Value(0)).current;
  const ring2Scale  = useRef(new Animated.Value(1)).current;
  const ring2Op     = useRef(new Animated.Value(0)).current;
  const ring3Scale  = useRef(new Animated.Value(1)).current;
  const ring3Op     = useRef(new Animated.Value(0)).current;

  // ── Brand internals
  const brandBgOp    = useRef(new Animated.Value(0)).current;   // white bg
  const topTextY     = useRef(new Animated.Value(-30)).current;
  const topTextOp    = useRef(new Animated.Value(0)).current;
  const dividerW     = useRef(new Animated.Value(0)).current;
  const botTextY     = useRef(new Animated.Value(30)).current;
  const botTextOp    = useRef(new Animated.Value(0)).current;
  const taglineOp    = useRef(new Animated.Value(0)).current;
  const taglineY     = useRef(new Animated.Value(12)).current;
  const ornamOp      = useRef(new Animated.Value(0)).current;

  // ── Hero slide anims + progress
  const slideAnims   = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideTimers  = useRef([]);

  // ── CTA internals
  const ctaSheetY  = useRef(new Animated.Value(260)).current;
  const ctaSheetOp = useRef(new Animated.Value(0)).current;
  const ctaItem1   = useRef(new Animated.Value(0)).current;
  const ctaItem2   = useRef(new Animated.Value(0)).current;
  const ctaItem3   = useRef(new Animated.Value(0)).current;
  const ctaItem4   = useRef(new Animated.Value(0)).current;
  const ctaDimmer  = useRef(new Animated.Value(0)).current;

  // ── Hero index cleanup ref
  const heroIndexRef = useRef(0);

  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    animateSplash();
    return () => slideTimers.current.forEach(clearTimeout);
  }, []);

  // ══ PHASE 0: SPLASH ══════════════════════════════════════════════════════
  function animateSplash() {
    // Logo elastic spring in
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 55,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Shimmer sweep across logo after logo appears
    Animated.sequence([
      Animated.delay(700),
      Animated.timing(shimmerX, {
        toValue: width * 0.5,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // 3 staggered ripple rings (heartbeat pattern)
    function pulseRing(scale, opacity, delay, cb) {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.7, duration: 200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 2.4, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0,   duration: 900, useNativeDriver: true }),
        ]),
      ]).start(cb);
    }

    Animated.sequence([
      Animated.delay(650),
    ]).start(() => {
      pulseRing(ring1Scale, ring1Op, 0, null);
      pulseRing(ring2Scale, ring2Op, 220, null);
      pulseRing(ring3Scale, ring3Op, 440, () => {
        // After rings finish, transition to brand
        Animated.delay(300).start(() => {
          crossFade(splashOp, brandOp, 520, () => animateBrand());
        });
      });
    });
  }

  // ══ PHASE 1: BRAND ═══════════════════════════════════════════════════════
  function animateBrand() {
    // White bg fades in first (native driver ✓ — we animate opacity of a white View)
    Animated.timing(brandBgOp, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    Animated.sequence([
      Animated.delay(120),
      // "BEAUTIFY" slides down from above
      Animated.parallel([
        Animated.timing(topTextOp, { toValue: 1, duration: 500, easing: EASE_OUT_QUART, useNativeDriver: true }),
        Animated.timing(topTextY,  { toValue: 0, duration: 500, easing: EASE_OUT_QUART, useNativeDriver: true }),
      ]),
      Animated.delay(80),
      // Divider draws from center
      Animated.timing(dividerW, { toValue: 1, duration: 460, easing: EASE_OUT_QUART, useNativeDriver: true }),
      Animated.delay(60),
      // "AFRICA" slides up from below
      Animated.parallel([
        Animated.timing(botTextOp, { toValue: 1, duration: 500, easing: EASE_OUT_QUART, useNativeDriver: true }),
        Animated.timing(botTextY,  { toValue: 0, duration: 500, easing: EASE_OUT_QUART, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      // Tagline + ornament fade in
      Animated.parallel([
        Animated.timing(taglineOp, { toValue: 1, duration: 440, useNativeDriver: true }),
        Animated.timing(taglineY,  { toValue: 0, duration: 440, easing: EASE_OUT_QUART, useNativeDriver: true }),
        Animated.timing(ornamOp,   { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      // Hold on brand for 900ms
      Animated.delay(900),
    ]).start(() => {
      crossFade(brandOp, heroOp, 600, () => animateHero(0));
    });
  }

  // ══ PHASE 2: HERO ════════════════════════════════════════════════════════
  function animateHero(idx) {
    heroIndexRef.current = idx;
    setHeroIndex(idx);

    // Ensure this slide is visible, others hidden
    slideAnims.forEach((a, i) => {
      if (i !== idx) a.setValue(0);
    });
    slideAnims[idx].setValue(1);

    // Progress bar fills over slide duration
    progressAnim.setValue(0);
    const SLIDE_DURATION = 2800;
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SLIDE_DURATION - 100,
      easing: Easing.linear,
      useNativeDriver: false, // width interpolation, needs JS driver
    }).start();

    const isLast = idx === SLIDES.length - 1;
    const t = setTimeout(() => {
      if (isLast) {
        // Last slide — cross-dissolve out and go to CTA
        Animated.timing(slideAnims[idx], {
          toValue: 0.15,
          duration: 500,
          useNativeDriver: true,
        }).start(() => animateCta());
      } else {
        // Cross-dissolve to next slide
        const next = idx + 1;
        slideAnims[next].setValue(0);
        Animated.parallel([
          Animated.timing(slideAnims[idx], { toValue: 0, duration: 600, easing: EASE_IN_OUT, useNativeDriver: true }),
          Animated.timing(slideAnims[next], { toValue: 1, duration: 600, easing: EASE_IN_OUT, useNativeDriver: true }),
        ]).start(() => animateHero(next));
      }
    }, SLIDE_DURATION);

    slideTimers.current.push(t);
  }

  // ══ PHASE 3: CTA ══════════════════════════════════════════════════════════
  function animateCta() {
    setShowCta(true);

    // Dim the hero image behind the sheet
    Animated.timing(ctaDimmer, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    // Sheet springs up
    Animated.sequence([
      Animated.delay(80),
      Animated.parallel([
        Animated.spring(ctaSheetY, { toValue: 0, tension: 58, friction: 10, useNativeDriver: true }),
        Animated.timing(ctaSheetOp, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    // Content staggers in
    const stagger = (anim, delay) =>
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 380, easing: EASE_OUT_QUART, useNativeDriver: true }),
      ]);

    Animated.sequence([
      Animated.delay(240),
      Animated.parallel([
        stagger(ctaItem1, 0),
        stagger(ctaItem2, 100),
        stagger(ctaItem3, 200),
        stagger(ctaItem4, 300),
      ]),
    ]).start();
  }

  // ─────────────────────────────────────────────────────────────────────────
  const handleGetStarted = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.replace('Auth', { mode: 'register' });
  }, [navigation]);

  const handleSignIn = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace('Auth', { mode: 'login' });
  }, [navigation]);

  const handleSkip = useCallback(() => {
    navigation.replace('MainTabs');
  }, [navigation]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ══════════════════════════════════════════════════════════
          LAYER 0 — HERO (bottom-most, persists behind everything)
      ══════════════════════════════════════════════════════════ */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: heroOp }]}>
        {SLIDES.map((slide, i) => (
          <HeroSlide
            key={i}
            slide={slide}
            visible={heroIndex === i}
            slideOpacity={slideAnims[i]}
          />
        ))}

        {/* Progress bar (shown during hero, fades when CTA appears) */}
        {!showCta && (
          <View style={styles.progressContainer}>
            <ProgressBar
              index={heroIndex}
              total={SLIDES.length}
              progressAnim={progressAnim}
            />
          </View>
        )}

        {/* CTA dimmer overlay */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(28,25,23,0.45)', opacity: ctaDimmer },
          ]}
          pointerEvents="none"
        />
      </Animated.View>

      {/* ══════════════════════════════════════════════════════════
          LAYER 1 — BRAND (sits above hero, fades out to hero)
      ══════════════════════════════════════════════════════════ */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.brandLayer, { opacity: brandOp }]}>
        {/* White background that fades in over the dark splash */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.brandBg, { opacity: brandBgOp }]} />

        {/* Decorative top ornament */}
        <Animated.View style={[styles.ornamentRow, { opacity: ornamOp }]}>
          <View style={styles.ornamentLine} />
          <View style={styles.ornamentDiamond} />
          <View style={styles.ornamentLine} />
        </Animated.View>

        {/* BEAUTIFY — slides down from top */}
        <Animated.Text
          style={[
            styles.brandWordTop,
            { opacity: topTextOp, transform: [{ translateY: topTextY }] },
          ]}
        >
          BEAUTIFY
        </Animated.Text>

        {/* Terracotta divider that scales from center */}
        <Animated.View
          style={[
            styles.brandDivider,
            { transform: [{ scaleX: dividerW }] },
          ]}
        />

        {/* AFRICA — slides up from bottom */}
        <Animated.Text
          style={[
            styles.brandWordBottom,
            { opacity: botTextOp, transform: [{ translateY: botTextY }] },
          ]}
        >
          AFRICA
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.brandTagline,
            { opacity: taglineOp, transform: [{ translateY: taglineY }] },
          ]}
        >
          Your Premier Beauty Destination
        </Animated.Text>

        {/* Bottom ornament */}
        <Animated.View style={[styles.ornamentRow, styles.ornamentBottom, { opacity: ornamOp }]}>
          <View style={styles.ornamentLine} />
          <View style={styles.ornamentDiamond} />
          <View style={styles.ornamentLine} />
        </Animated.View>
      </Animated.View>

      {/* ══════════════════════════════════════════════════════════
          LAYER 2 — SPLASH (top-most at start, fades to zero)
      ══════════════════════════════════════════════════════════ */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.splashLayer, { opacity: splashOp }]}
        pointerEvents="none"
      >
        {/* Ripple ring 1 */}
        <Animated.View
          style={[
            styles.ring,
            { transform: [{ scale: ring1Scale }], opacity: ring1Op },
          ]}
        />
        {/* Ripple ring 2 */}
        <Animated.View
          style={[
            styles.ring,
            styles.ring2,
            { transform: [{ scale: ring2Scale }], opacity: ring2Op },
          ]}
        />
        {/* Ripple ring 3 */}
        <Animated.View
          style={[
            styles.ring,
            styles.ring3,
            { transform: [{ scale: ring3Scale }], opacity: ring3Op },
          ]}
        />

        {/* Logo mark */}
        <Animated.View
          style={[
            styles.logoMarkContainer,
            { transform: [{ scale: logoScale }], opacity: logoOpacity },
          ]}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Brand name under logo */}
        <Animated.Text style={[styles.splashBrandText, { opacity: logoOpacity }]}>
          BEAUTIFY AFRICA
        </Animated.Text>
      </Animated.View>

      {/* ══════════════════════════════════════════════════════════
          LAYER 3 — CTA SHEET (slides up over hero image)
      ══════════════════════════════════════════════════════════ */}
      {showCta && (
        <Animated.View
          style={[
            styles.ctaSheet,
            { opacity: ctaSheetOp, transform: [{ translateY: ctaSheetY }] },
          ]}
        >
          {/* Mini brand badge row */}
          <Animated.View style={[styles.ctaBadgeRow, { opacity: ctaItem1 }]}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.ctaLogoMiniImage}
              resizeMode="contain"
            />
            <Text style={styles.ctaBrandBadge}>BEAUTIFY AFRICA</Text>
            <View style={styles.ctaBadgeSpacer} />
            <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.ctaSkipInline}>Skip</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Heading */}
          <Animated.Text style={[styles.ctaHeading, { opacity: ctaItem2 }]}>
            Your Destination For{'\n'}All Things Beauty
          </Animated.Text>

          {/* Sub text */}
          <Animated.Text style={[styles.ctaSub, { opacity: ctaItem2 }]}>
            Shop skincare, makeup, haircare & fragrance from top global and local brands.
          </Animated.Text>

          {/* Primary CTA */}
          <Animated.View style={{ opacity: ctaItem3 }}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleGetStarted}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={[colors.primary, '#A24F36']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryBtnText}>Start Shopping</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Sign In */}
          <Animated.View style={[styles.signInRow, { opacity: ctaItem4 }]}>
            <TouchableOpacity onPress={handleSignIn} activeOpacity={0.75} style={styles.signInBtn}>
              <Text style={styles.signInText}>
                Already a member?{' '}
                <Text style={styles.signInHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Three trust badges */}
          <Animated.View style={[styles.badgesRow, { opacity: ctaItem4 }]}>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>✨</Text>
              <Text style={styles.badgeText}>100% Authentic</Text>
            </View>
            <View style={styles.badgeDivider} />
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🚚</Text>
              <Text style={styles.badgeText}>Fast Delivery</Text>
            </View>
            <View style={styles.badgeDivider} />
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🛍️</Text>
              <Text style={styles.badgeText}>Best Brands</Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const LOGO_SIZE = 92;
const RING_SIZE = LOGO_SIZE + 10;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceDark,
  },

  // ── Splash ──────────────────────────────────────────
  splashLayer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceDark,
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ring2: {
    borderColor: colors.gold,
    borderWidth: 1,
  },
  ring3: {
    borderColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
  },
  logoMarkContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 130,
    height: 130,
  },
  ctaLogoMiniImage: {
    width: 32,
    height: 32,
    marginRight: spacing.xs,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  goldDot: {
    position: 'absolute',
    bottom: 15,
    right: 13,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.gold,
  },
  splashBrandText: {
    marginTop: spacing.xl,
    fontSize: 12,
    fontWeight: typography.weights.semibold,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },

  // ── Brand ───────────────────────────────────────────
  brandLayer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBg: {
    backgroundColor: '#FAF7F2',
  },
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  ornamentBottom: {
    marginBottom: 0,
    marginTop: spacing.xxl,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    maxWidth: 60,
  },
  ornamentDiamond: {
    width: 8,
    height: 8,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }],
  },
  brandWordTop: {
    fontSize: 38,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: 13,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  brandDivider: {
    width: 88,
    height: 2.5,
    backgroundColor: colors.primary,
    marginVertical: spacing.md,
    borderRadius: radii.full,
  },
  brandWordBottom: {
    fontSize: 38,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 13,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  brandTagline: {
    marginTop: spacing.xl,
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  // ── Hero Slides ─────────────────────────────────────
  slideImage: {
    width,
    height,
  },
  slideLabel: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 72,
    right: spacing.xxl,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  slideEdgeBar: {
    position: 'absolute',
    bottom: 248,
    left: spacing.xxl,
    width: 3,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  slideTagline: {
    position: 'absolute',
    bottom: 226,
    left: spacing.xxl + 16,
    right: spacing.xxl,
    fontSize: typography.sizes.xxl + 4,
    fontWeight: typography.weights.bold,
    color: colors.surface,
    lineHeight: 40,
    letterSpacing: 0.2,
  },
  slideSub: {
    position: 'absolute',
    bottom: 200,
    left: spacing.xxl + 16,
    right: spacing.xxl,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Progress Bar ─────────────────────────────────────
  progressContainer: {
    position: 'absolute',
    bottom: 160,
    left: spacing.xxl,
    right: spacing.xxl,
  },
  progressTrack: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressSegment: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.surface,
    borderRadius: 1,
  },

  // ── CTA Sheet ────────────────────────────────────────
  ctaSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl + 2,
    paddingBottom: Platform.OS === 'android' ? spacing.xxxl + 14 : spacing.xxxl + 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 24,
  },
  ctaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg + 2,
  },
  ctaLogoMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  ctaLogoLetter: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.surface,
    lineHeight: 16,
  },
  ctaBrandBadge: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textTertiary,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  ctaBadgeSpacer: { flex: 1 },
  ctaSkipInline: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    letterSpacing: 0.3,
  },
  ctaHeading: {
    fontSize: typography.sizes.xl + 2,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 32,
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  ctaSub: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  primaryBtn: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 9,
  },
  primaryGradient: {
    paddingVertical: spacing.lg + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: typography.sizes.md + 1,
    fontWeight: typography.weights.bold,
    color: colors.surface,
    letterSpacing: 0.8,
  },
  signInRow: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  signInBtn: {
    paddingVertical: spacing.sm,
  },
  signInText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  signInHighlight: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  badge: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: typography.weights.medium,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  badgeDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
});
