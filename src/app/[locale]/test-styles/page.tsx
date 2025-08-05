"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Calculator, Heart, Star, Settings, Check } from 'lucide-react';

export default function TestStylesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            CSS Styles Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Testing shadcn/ui components and Tailwind CSS
          </p>
        </div>

        {/* Basic Tailwind Classes Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">
              🎨 Basic Tailwind CSS Test
            </CardTitle>
            <CardDescription>
              Testing basic Tailwind classes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                <p className="text-red-800 font-semibold">Red Box</p>
              </div>
              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <p className="text-green-800 font-semibold">Green Box</p>
              </div>
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                <p className="text-blue-800 font-semibold">Blue Box</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Components Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600">
              🔘 Button Components Test
            </CardTitle>
            <CardDescription>
              Testing different button variants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">
                <Calculator className="w-4 h-4" />
                Default Button
              </Button>
              <Button variant="secondary">
                <Heart className="w-4 h-4" />
                Secondary Button
              </Button>
              <Button variant="outline">
                <Star className="w-4 h-4" />
                Outline Button
              </Button>
              <Button variant="destructive">
                <Settings className="w-4 h-4" />
                Destructive Button
              </Button>
              <Button variant="ghost">
                Ghost Button
              </Button>
              <Button variant="link">
                Link Button
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small Button</Button>
              <Button size="default">Default Size</Button>
              <Button size="lg">Large Button</Button>
              <Button size="icon">
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card Components Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                This is a default card variant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Content of the default card with some text to test typography.
              </p>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
              <CardDescription>
                This is an outlined card variant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Content of the outlined card with some text to test typography.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>
                This is an elevated card variant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Content of the elevated card with shadow effect.
              </p>
            </CardContent>
          </Card>

          <Card variant="filled">
            <CardHeader>
              <CardTitle>Filled Card</CardTitle>
              <CardDescription>
                This is a filled card variant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Content of the filled card with background.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Input Components Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">
              📝 Input Components Test
            </CardTitle>
            <CardDescription>
              Testing input fields and forms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Input
                </label>
                <Input 
                  type="text" 
                  placeholder="Enter some text..." 
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number Input
                </label>
                <Input 
                  type="number" 
                  placeholder="Enter a number..." 
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600">
              📚 Typography Test
            </CardTitle>
            <CardDescription>
              Testing different text styles and sizes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Heading 1</h1>
              <h2 className="text-3xl font-semibold text-gray-800">Heading 2</h2>
              <h3 className="text-2xl font-medium text-gray-700">Heading 3</h3>
              <h4 className="text-xl font-medium text-gray-600">Heading 4</h4>
              <p className="text-base text-gray-600">
                Regular paragraph text with <strong>bold text</strong> and <em>italic text</em>.
              </p>
              <p className="text-sm text-gray-500">Small text</p>
              <p className="text-xs text-gray-400">Extra small text</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-600">
              🔍 CSS Status Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg">
                <strong>If you can see:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Colored backgrounds and borders</li>
                <li>Proper spacing and layout</li>
                <li>Styled buttons with hover effects</li>
                <li>Card shadows and borders</li>
                <li>Proper typography</li>
              </ul>
              <p className="text-lg font-semibold text-green-600 mt-4">
                ✅ Then CSS is working correctly!
              </p>
              <p className="text-lg font-semibold text-red-600">
                ❌ If this looks like plain HTML, CSS is not loading.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
