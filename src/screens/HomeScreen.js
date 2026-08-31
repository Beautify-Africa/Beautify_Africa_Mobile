import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import CustomButton from '../components/CustomButton';
import Badge from '../components/Badge';
import { productsApi } from '../services/productsApi';
import {
  MOCK_EDITORIAL_STORIES,
  MOCK_CATEGORIES,
  MOCK_TRUST_ITEMS,
  MOCK_PROMO_BANNERS,
} from '../services/mockData';

const ROTATING_WORDS = ['Beauty', 'Skincare', 'Glamour', 'Glow', 'Style'];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    loadHomeData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  async function loadHomeData() {
    try {
      const res = await productsApi.getProducts({ limit: 12 });
      if (res.data) setProducts(res.data);
    } catch {
      // Handled via offline mock
    } finally {
      setRefreshing(false);
    }
  }

  const bestsellers = products.filter((p) => p.isBestSeller) || products.slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewProduct) || products.slice(2, 6);
  const featuredProduct = products.find((p) => p.slug === 'the-velvet-botanique-no-4') || products[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Header transparent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadHomeData();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Editorial Hero Banner */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(28, 25, 23, 0.65)', 'rgba(28, 25, 23, 0.3)', 'rgba(28, 25, 23, 0.9)']}
            locations={[0, 0.4, 1]}
            style={styles.heroOverlay}
          >
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>NEW SEASON ESSENTIALS</Text>
            </View>
            <Text style={styles.heroTitle}>
              Everyday <Text style={styles.heroTitleHighlight}>{ROTATING_WORDS[wordIndex]}</Text>
              {'\n'}For Everyone.
            </Text>
            <Text style={styles.heroSubtitle}>
              Explore top skincare, makeup, haircare, and fragrances curated for you.
            </Text>
            <View style={styles.heroActions}>
              <CustomButton
                title="Shop All Beauty"
                variant="gold"
                size="md"
                onPress={() => navigation.navigate('Shop')}
                icon={<Ionicons name="sparkles" size={16} color={colors.surfaceDark} />}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Promo Strip */}
        <View style={styles.promoStrip}>
          <Ionicons name="gift-outline" size={16} color={colors.surface} />
          <Text style={styles.promoText}>
            Use code <Text style={styles.promoCodeBold}>{MOCK_PROMO_BANNERS[0]?.code || 'BEAUTY15'}</Text> for 15% off your first mobile order
          </Text>
        </View>

        {/* Shop By Category */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>POPULAR CATEGORIES</Text>
            <Text style={styles.sectionTitle}>Shop By Category</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {MOCK_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate('Shop', {
                  screen: 'ShopMain',
                  params: { selectedCategory: cat.id },
                })
              }
            >
              <View style={styles.categoryIconCircle}>
                <Ionicons
                  name={
                    cat.id === 'Skincare'
                      ? 'water-outline'
                      : cat.id === 'Makeup'
                      ? 'color-palette-outline'
                      : cat.id === 'Hair Care'
                      ? 'cut-outline'
                      : cat.id === 'Fragrance'
                      ? 'flask-outline'
                      : cat.id === 'Bath & Body'
                      ? 'happy-outline'
                      : cat.id === 'Tools & Brushes'
                      ? 'brush-outline'
                      : 'sparkles-outline'
                  }
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Current Obsession Highlight Card */}
        {featuredProduct && (
          <View style={styles.obsessionWrapper}>
            <View style={styles.sectionHeaderNoPad}>
              <View>
                <Text style={styles.sectionEyebrow}>FEATURED PICK</Text>
                <Text style={styles.sectionTitle}>Beauty Spotlight</Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.95}
              style={styles.obsessionCard}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  productId: featuredProduct._id,
                  product: featuredProduct,
                })
              }
            >
              <Image source={{ uri: featuredProduct.image }} style={styles.obsessionImage} />
              <LinearGradient
                colors={['transparent', 'rgba(28, 25, 23, 0.85)']}
                style={styles.obsessionOverlay}
              >
                <Badge label="POPULAR" variant="bestseller" style={{ marginBottom: 6 }} />
                <Text style={styles.obsessionTitle}>{featuredProduct.name}</Text>
                <Text style={styles.obsessionDesc} numberOfLines={2}>
                  {featuredProduct.description}
                </Text>
                <View style={styles.obsessionFooter}>
                  <Text style={styles.obsessionPrice}>${featuredProduct.price.toFixed(2)}</Text>
                  <View style={styles.obsessionBtn}>
                    <Text style={styles.obsessionBtnText}>Shop Now</Text>
                    <Ionicons name="arrow-forward" size={14} color={colors.surface} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Bestselling Products Carousel */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Bestselling Favorites</Text>
            <Text style={styles.sectionSubtitle}>Trending beauty products loved by customers</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.seeAllText}>Explore</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={bestsellers.length > 0 ? bestsellers : products}
          keyExtractor={(item) => item._id || String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <View style={{ width: 175, marginRight: spacing.md }}>
              <ProductCard product={item} />
            </View>
          )}
        />

        {/* The Beautify Promise (Trust Badges) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>WHY SHOP WITH US</Text>
            <Text style={styles.sectionTitle}>The Beautify Guarantee</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trustScroll}
        >
          {MOCK_TRUST_ITEMS.map((trust) => (
            <View key={trust.id} style={styles.trustCard}>
              <View style={styles.trustIconCircle}>
                <Ionicons name={trust.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.trustTitle}>{trust.title}</Text>
              <Text style={styles.trustDesc} numberOfLines={3}>
                {trust.desc}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Brand Banner */}
        <View style={styles.storyBanner}>
          <View style={styles.storyTextContent}>
            <Text style={styles.storyEyebrow}>EVERYDAY BEAUTY FOR ALL</Text>
            <Text style={styles.storyTitle}>Your One-Stop Beauty Hub</Text>
            <Text style={styles.storyDesc}>
              Discover authentic skincare, makeup, haircare, and fragrances delivered right to your doorstep.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AboutBrand')}
              style={styles.learnMoreBtn}
            >
              <Text style={styles.learnMoreText}>Learn About Us</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Arrivals Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Fresh Beauty Arrivals</Text>
            <Text style={styles.sectionSubtitle}>New products added weekly</Text>
          </View>
        </View>
        <View style={styles.gridContainer}>
          {newArrivals.map((prod) => (
            <View key={prod._id || String(prod.id)} style={styles.gridItem}>
              <ProductCard product={prod} />
            </View>
          ))}
        </View>

        {/* The Journal & Wisdom Stories */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>EDITORIAL</Text>
            <Text style={styles.sectionTitle}>The Journal</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesScroll}
        >
          {MOCK_EDITORIAL_STORIES.map((story) => (
            <TouchableOpacity
              key={story.id}
              activeOpacity={0.9}
              style={styles.storyCard}
              onPress={() => navigation.navigate('AboutBrand')}
            >
              <Image source={{ uri: story.image }} style={styles.storyImage} />
              <View style={styles.storyCardContent}>
                <Text style={styles.storyCategory}>{story.category} • {story.readTime}</Text>
                <Text style={styles.storyCardTitle} numberOfLines={2}>
                  {story.title}
                </Text>
                <Text style={styles.storySnippet} numberOfLines={2}>
                  {story.snippet}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroContainer: {
    height: 480,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 25) + 65 : 95,
    justifyContent: 'flex-end',
  },
  heroBadge: {
    backgroundColor: colors.desertOchre,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  heroBadgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    color: colors.surface,
    lineHeight: 36,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.surfaceVariant,
    lineHeight: 20,
    marginBottom: spacing.lg,
    maxWidth: '90%',
  },
  heroActions: {
    flexDirection: 'row',
  },
  promoStrip: {
    backgroundColor: colors.forestGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  promoText: {
    color: colors.surface,
    fontSize: typography.sizes.xs + 1,
  },
  promoCodeBold: {
    fontWeight: typography.weights.bold,
    color: colors.goldLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    width: 76,
  },
  categoryIconCircle: {
    width: 58,
    height: 58,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
  },
  storyBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  storyEyebrow: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  heroTitleHighlight: {
    color: colors.goldLight,
    fontStyle: 'italic',
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  sectionHeaderNoPad: {
    paddingBottom: spacing.sm,
  },
  obsessionWrapper: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxl,
  },
  obsessionCard: {
    height: 250,
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  obsessionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  obsessionOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  obsessionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.surface,
    marginBottom: 4,
  },
  obsessionDesc: {
    fontSize: typography.sizes.xs + 1,
    color: colors.surfaceVariant,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  obsessionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  obsessionPrice: {
    fontSize: typography.sizes.md + 1,
    fontWeight: typography.weights.bold,
    color: colors.goldLight,
  },
  obsessionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.full,
  },
  obsessionBtnText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.semibold,
    color: colors.surface,
  },
  trustScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  trustCard: {
    width: 170,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trustIconCircle: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  trustTitle: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  trustDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  storyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  storyDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  learnMoreText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
  },
  storiesScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  storyCard: {
    width: 240,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  storyImage: {
    width: '100%',
    height: 130,
  },
  storyCardContent: {
    padding: spacing.md,
  },
  storyCategory: {
    fontSize: 10,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  storyCardTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  storySnippet: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
