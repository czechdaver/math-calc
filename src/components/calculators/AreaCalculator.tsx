// src/components/calculators/AreaCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Square, Triangle, Circle, Hexagon } from 'lucide-react';

interface AreaResult {
  area: number;
  perimeter: number;
  shape: string;
  dimensions: Record<string, number>;
  isValid: boolean;
}

const AreaCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [shape, setShape] = useState<string>('rectangle');

  // Rectangle/Square dimensions
  const [length, setLength] = useState<string>('10');
  const [width, setWidth] = useState<string>('8');

  // Circle dimensions
  const [radius, setRadius] = useState<string>('5');

  // Triangle dimensions
  const [base, setBase] = useState<string>('10');
  const [height, setHeight] = useState<string>('8');

  // Trapezoid dimensions
  const [topBase, setTopBase] = useState<string>('6');
  const [bottomBase, setBottomBase] = useState<string>('10');
  const [trapHeight, setTrapHeight] = useState<string>('8');

  const [result, setResult] = useState<AreaResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format area
  const formatArea = (area: number): string => {
    return area.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' m²';
  };

  // Format perimeter
  const formatPerimeter = (perimeter: number): string => {
    return perimeter.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' m';
  };

  // Validation function
  const validateInputs = (shapeType: string) => {
    const newErrors: Record<string, string> = {};

    if (shapeType === 'rectangle' || shapeType === 'square') {
      const lengthNum = parseFloat(length);
      const widthNum = parseFloat(width);

      if (!length || isNaN(lengthNum) || lengthNum <= 0) {
        newErrors.length = t('area_error_length');
      }
      if (shapeType === 'rectangle' && (!width || isNaN(widthNum) || widthNum <= 0)) {
        newErrors.width = t('area_error_width');
      }
    } else if (shapeType === 'circle') {
      const radiusNum = parseFloat(radius);

      if (!radius || isNaN(radiusNum) || radiusNum <= 0) {
        newErrors.radius = t('area_error_radius');
      }
    } else if (shapeType === 'triangle') {
      const baseNum = parseFloat(base);
      const heightNum = parseFloat(height);

      if (!base || isNaN(baseNum) || baseNum <= 0) {
        newErrors.base = t('area_error_base');
      }
      if (!height || isNaN(heightNum) || heightNum <= 0) {
        newErrors.height = t('area_error_height');
      }
    } else if (shapeType === 'trapezoid') {
      const topNum = parseFloat(topBase);
      const bottomNum = parseFloat(bottomBase);
      const heightNum = parseFloat(trapHeight);

      if (!topBase || isNaN(topNum) || topNum <= 0) {
        newErrors.topBase = t('area_error_top_base');
      }
      if (!bottomBase || isNaN(bottomNum) || bottomNum <= 0) {
        newErrors.bottomBase = t('area_error_bottom_base');
      }
      if (!trapHeight || isNaN(heightNum) || heightNum <= 0) {
        newErrors.trapHeight = t('area_error_height');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate rectangle area
  const calculateRectangle = (l: number, w: number): AreaResult => {
    const area = l * w;
    const perimeter = 2 * (l + w);

    return {
      area,
      perimeter,
      shape: 'rectangle',
      dimensions: { length: l, width: w },
      isValid: true
    };
  };

  // Calculate square area
  const calculateSquare = (side: number): AreaResult => {
    const area = side * side;
    const perimeter = 4 * side;

    return {
      area,
      perimeter,
      shape: 'square',
      dimensions: { side },
      isValid: true
    };
  };

  // Calculate circle area
  const calculateCircle = (r: number): AreaResult => {
    const area = Math.PI * r * r;
    const perimeter = 2 * Math.PI * r;

    return {
      area,
      perimeter,
      shape: 'circle',
      dimensions: { radius: r },
      isValid: true
    };
  };

  // Calculate triangle area
  const calculateTriangle = (b: number, h: number): AreaResult => {
    const area = 0.5 * b * h;
    // For perimeter, we assume an isosceles triangle
    const side = Math.sqrt((b / 2) * (b / 2) + h * h);
    const perimeter = b + 2 * side;

    return {
      area,
      perimeter,
      shape: 'triangle',
      dimensions: { base: b, height: h },
      isValid: true
    };
  };

  // Calculate trapezoid area
  const calculateTrapezoid = (a: number, b: number, h: number): AreaResult => {
    const area = 0.5 * (a + b) * h;
    // For perimeter, we assume the sides are equal
    const side = Math.sqrt(((b - a) / 2) * ((b - a) / 2) + h * h);
    const perimeter = a + b + 2 * side;

    return {
      area,
      perimeter,
      shape: 'trapezoid',
      dimensions: { topBase: a, bottomBase: b, height: h },
      isValid: true
    };
  };

  // Get shape description
  const getShapeDescription = (shapeType: string): string => {
    switch (shapeType) {
      case 'rectangle': return t('area_shape_rectangle');
      case 'square': return t('area_shape_square');
      case 'circle': return t('area_shape_circle');
      case 'triangle': return t('area_shape_triangle');
      case 'trapezoid': return t('area_shape_trapezoid');
      default: return t('area_shape_rectangle');
    }
  };

  // Get shape icon
  const getShapeIcon = (shapeType: string) => {
    switch (shapeType) {
      case 'rectangle': return <Square className="w-6 h-6" />;
      case 'square': return <Square className="w-6 h-6" />;
      case 'circle': return <Circle className="w-6 h-6" />;
      case 'triangle': return <Triangle className="w-6 h-6" />;
      case 'trapezoid': return <Hexagon className="w-6 h-6" />;
      default: return <Square className="w-6 h-6" />;
    }
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(shape)) {
      let calculatedResult: AreaResult;

      if (shape === 'rectangle') {
        const l = parseFloat(length);
        const w = parseFloat(width);
        calculatedResult = calculateRectangle(l, w);
      } else if (shape === 'square') {
        const side = parseFloat(length);
        calculatedResult = calculateSquare(side);
      } else if (shape === 'circle') {
        const r = parseFloat(radius);
        calculatedResult = calculateCircle(r);
      } else if (shape === 'triangle') {
        const b = parseFloat(base);
        const h = parseFloat(height);
        calculatedResult = calculateTriangle(b, h);
      } else {
        const a = parseFloat(topBase);
        const b = parseFloat(bottomBase);
        const h = parseFloat(trapHeight);
        calculatedResult = calculateTrapezoid(a, b, h);
      }

      setResult(calculatedResult);
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, length, width, radius, base, height, topBase, bottomBase, trapHeight]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Shape Selection */}
      <div className="space-y-2">
        <Label htmlFor="shape" className="text-sm font-medium">
          {t('area_label_shape')}
        </Label>
        <Select value={shape} onValueChange={setShape}>
          <SelectTrigger>
            <SelectValue placeholder={t('area_placeholder_shape')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangle">{t('area_shape_rectangle')}</SelectItem>
            <SelectItem value="square">{t('area_shape_square')}</SelectItem>
            <SelectItem value="circle">{t('area_shape_circle')}</SelectItem>
            <SelectItem value="triangle">{t('area_shape_triangle')}</SelectItem>
            <SelectItem value="trapezoid">{t('area_shape_trapezoid')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {getShapeDescription(shape)} - {t('area_calc_hint')}
        </p>
      </div>

      {/* Rectangle/Square Inputs */}
      {(shape === 'rectangle' || shape === 'square') && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="length" className="text-sm font-medium">
              {shape === 'square' ? t('area_label_side') : t('area_label_length')}
            </Label>
            <Input
              id="length"
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="10"
              className={`${errors.length ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.length && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.length}
              </p>
            )}
          </div>

          {shape === 'rectangle' && (
            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm font-medium">
                {t('area_label_width')}
              </Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="8"
                className={`${errors.width ? 'border-red-500' : ''}`}
                min="0"
                step="0.1"
              />
              {errors.width && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.width}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Circle Inputs */}
      {shape === 'circle' && (
        <div className="space-y-2">
          <Label htmlFor="radius" className="text-sm font-medium">
            {t('area_label_radius')}
          </Label>
          <Input
            id="radius"
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="5"
            className={`${errors.radius ? 'border-red-500' : ''}`}
            min="0"
            step="0.1"
          />
          {errors.radius && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.radius}
            </p>
          )}
        </div>
      )}

      {/* Triangle Inputs */}
      {shape === 'triangle' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="base" className="text-sm font-medium">
              {t('area_label_base')}
            </Label>
            <Input
              id="base"
              type="number"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              placeholder="10"
              className={`${errors.base ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.base && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.base}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium">
              {t('area_label_height')}
            </Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="8"
              className={`${errors.height ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.height && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.height}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Trapezoid Inputs */}
      {shape === 'trapezoid' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topBase" className="text-sm font-medium">
              {t('area_label_top_base')}
            </Label>
            <Input
              id="topBase"
              type="number"
              value={topBase}
              onChange={(e) => setTopBase(e.target.value)}
              placeholder="6"
              className={`${errors.topBase ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.topBase && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.topBase}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bottomBase" className="text-sm font-medium">
              {t('area_label_bottom_base')}
            </Label>
            <Input
              id="bottomBase"
              type="number"
              value={bottomBase}
              onChange={(e) => setBottomBase(e.target.value)}
              placeholder="10"
              className={`${errors.bottomBase ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.bottomBase && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.bottomBase}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trapHeight" className="text-sm font-medium">
              {t('area_label_height')}
            </Label>
            <Input
              id="trapHeight"
              type="number"
              value={trapHeight}
              onChange={(e) => setTrapHeight(e.target.value)}
              placeholder="8"
              className={`${errors.trapHeight ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.trapHeight && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.trapHeight}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              {getShapeIcon(shape)}
              {t('area_summary_calc')} - {getShapeDescription(shape)}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {shape === 'rectangle' && `${length} × ${width} m`}
              {shape === 'square' && `${length} × ${length} m`}
              {shape === 'circle' && `r = ${radius} m`}
              {shape === 'triangle' && `${t('area_label_triangle_base')} ${base} m, ${t('area_label_triangle_height')} ${height} m`}
              {shape === 'trapezoid' && `${topBase}/${bottomBase} m, ${t('area_label_triangle_height')} ${trapHeight} m`}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatArea(result.area)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              {t('area_result_area_of')} {getShapeDescription(result.shape).toLowerCase()}
            </div>
          </div>
          {getShapeIcon(result.shape)}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatArea(result.area)}
            </div>
            <div className="text-sm text-blue-700 mt-1">{t('area_result_area')}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">
              {formatPerimeter(result.perimeter)}
            </div>
            <div className="text-sm text-purple-700 mt-1">{t('area_result_perimeter')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('area_detail_title')}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('area_detail_shape')}</span>
                  <span className="font-mono">{getShapeDescription(result.shape)}</span>
                </div>
                {result.shape === 'rectangle' && (
                  <>
                    <div className="flex justify-between">
                      <span>{t('area_detail_length')}</span>
                      <span className="font-mono">{result.dimensions.length} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('area_detail_width')}</span>
                      <span className="font-mono">{result.dimensions.width} m</span>
                    </div>
                  </>
                )}
                {result.shape === 'square' && (
                  <div className="flex justify-between">
                    <span>{t('area_detail_side')}</span>
                    <span className="font-mono">{result.dimensions.side} m</span>
                  </div>
                )}
                {result.shape === 'circle' && (
                  <div className="flex justify-between">
                    <span>{t('area_detail_radius')}</span>
                    <span className="font-mono">{result.dimensions.radius} m</span>
                  </div>
                )}
                {result.shape === 'triangle' && (
                  <>
                    <div className="flex justify-between">
                      <span>{t('area_detail_base')}</span>
                      <span className="font-mono">{result.dimensions.base} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('area_detail_height')}</span>
                      <span className="font-mono">{result.dimensions.height} m</span>
                    </div>
                  </>
                )}
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('area_result_area')}:</span>
                  <span className="font-mono">{formatArea(result.area)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>{t('area_result_perimeter')}:</span>
                  <span className="font-mono">{formatPerimeter(result.perimeter)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practical Applications */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">{t('area_practical_title')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-green-50 rounded">
              <div className="font-medium text-green-800 mb-1">{t('area_practical_construction_title')}</div>
              <div className="text-green-700">{t('area_practical_construction_desc')}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <div className="font-medium text-blue-800 mb-1">{t('area_practical_garden_title')}</div>
              <div className="text-blue-700">{t('area_practical_garden_desc')}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="font-medium text-purple-800 mb-1">{t('area_practical_painting_title')}</div>
              <div className="text-purple-700">{t('area_practical_painting_desc')}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded">
              <div className="font-medium text-orange-800 mb-1">{t('area_practical_materials_title')}</div>
              <div className="text-orange-700">{t('area_practical_materials_desc')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <Square className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('area_empty_message')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('area_page_title')}
      description={t('area_page_description')}
      category={t('area_page_category')}
      calculatorId="area"
      seo={{
        title: t('area_seo_title'),
        description: t('area_seo_description'),
        keywords: t('area_seo_keywords').split(',')
      }}
      formula={{
        latex: t('area_formula_latex'),
        description: t('area_formula_description')
      }}
      examples={{
        title: t('area_examples_title'),
        description: t('area_examples_description'),
        scenarios: [
          {
            title: t('area_example_1_title'),
            description: t('area_example_1_description'),
            example: t('area_example_1_example')
          },
          {
            title: t('area_example_2_title'),
            description: t('area_example_2_description'),
            example: t('area_example_2_example')
          },
          {
            title: t('area_example_3_title'),
            description: t('area_example_3_description'),
            example: t('area_example_3_example')
          }
        ]
      }}
      faq={[
        {
          question: t('area_faq_1_q'),
          answer: t('area_faq_1_a')
        },
        {
          question: t('area_faq_2_q'),
          answer: t('area_faq_2_a')
        },
        {
          question: t('area_faq_3_q'),
          answer: t('area_faq_3_a')
        },
        {
          question: t('area_faq_4_q'),
          answer: t('area_faq_4_a')
        }
      ]}
      schemaData={{
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any"
      }}
      resultSection={resultsSection}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default AreaCalculator;
