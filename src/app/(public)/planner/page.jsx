"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Utensils, 
  Flame, 
  Apple, 
  Droplet, 
  Sparkles,
  Printer
} from "lucide-react";

// Mock Data for Initial State
const INITIAL_MEALS = {
  Monday: { Breakfast: "Avocado Toast & Poached Eggs", Lunch: "Grilled Chicken Quinoa Bowl", Dinner: "Baked Salmon with Asparagus" },
  Tuesday: { Breakfast: "Greek Yogurt Berry Parfait", Lunch: "Turkey Avocado Wrap", Dinner: "Beef Broccoli Stir-fry" },
  Wednesday: { Breakfast: "Oatmeal with Almonds & Banana", Lunch: "Salmon Quinoa Leftovers", Dinner: "Mediterranean Chickpea Salad" },
  Thursday: { Breakfast: "Scrambled Eggs with Spinach", Lunch: "Lentil Soup & Whole Wheat Bread", Dinner: "Lemon Herb Cod with Sweet Potato" },
  Friday: { Breakfast: "Protein Smoothie Bowl", Lunch: "Chicken Caesar Salad (Light)", Dinner: "Homemade Veggie Supreme Pizza" },
  Saturday: { Breakfast: "Whole Wheat Pancakes", Lunch: "Buddha Salad Bowl", Dinner: "Grilled Steak with Roasted Veggies" },
  Sunday: { Breakfast: "Veggie Omelette", Lunch: "Tuna Salad Salad Lettuce Boats", Dinner: "Slow Cooker Chicken Chili" }
};

const MACROS = { calories: "1,850 kcal", protein: "140g", carbs: "165g", fats: "62g" };

const SHOPPING_LIST = [
  { ingredient: "Fresh Atlantic Salmon", qty: "3 fillets", category: "Proteins" },
  { ingredient: "Organic Chicken Breast", qty: "1.5 kg", category: "Proteins" },
  { ingredient: "Avocados", qty: "5 pcs", category: "Produce" },
  { ingredient: "Baby Spinach", qty: "500g", category: "Produce" },
  { ingredient: "Quinoa", qty: "1 bag", category: "Pantry" },
  { ingredient: "Greek Yogurt (0%)", qty: "1kg", category: "Dairy" }
];

export default function MealPlanner() {
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [activeDay, setActiveDay] = useState("Monday");
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMealText, setNewMealText] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("Breakfast");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealSlots = ["Breakfast", "Lunch", "Dinner"];

  const handleClearSlot = (day, slot) => {
    setMeals(prev => ({
      ...prev,
      [day]: { ...prev[day], [slot]: "" }
    }));
  };

  const handleAddMealSubmit = (e) => {
    e.preventDefault();
    if (!newMealText.trim()) return;

    setMeals(prev => ({
      ...prev,
      [activeDay]: { ...prev[activeDay], [selectedSlot]: newMealText }
    }));
    setNewMealText("");
    setIsAddingMeal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm tracking-wide uppercase">
            <Sparkles className="w-4 h-4" /> Cooking Hub Premium
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mt-1">Weekly Meal Architecture</h1>
          <p className="text-sm text-slate-400">Design your metabolic calendar, track macronutrient targets, and auto-compile shopping pipelines.</p>
        </div>
        
        {/* Date Selector Controls */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="flex items-center bg-white border border-slate-200/80 rounded-xl shadow-sm p-1">
            <button className="p-2 hover:bg-slate-50 text-slate-500 rounded-lg transition"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-xs font-bold text-slate-700 px-3 flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> June 22 – June 28
            </span>
            <button className="p-2 hover:bg-slate-50 text-slate-500 rounded-lg transition"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button className="p-3 bg-white border border-slate-200/80 text-slate-500 rounded-xl hover:bg-slate-50 transition shadow-sm" title="Print Matrix">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Core Grid Matrix Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        
        {/* Left 3 Columns: Main Calendar Matrix */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Day Navigation Tabs (Mobile Adaptive) */}
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none snap-x">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex-shrink-0 snap-center border ${
                  activeDay === day
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200/70 hover:bg-slate-50"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Focused Day Detail Slots Dashboard */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{activeDay} Schedule</h2>
                <p className="text-xs text-slate-400">Curate recipe designations across temporal check-ins.</p>
              </div>
              <button 
                onClick={() => setIsAddingMeal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" /> Inject Recipe
              </button>
            </div>

            {/* Quick Meal Input Modal Form Overlay (Conditional State) */}
            {isAddingMeal && (
              <form onSubmit={handleAddMealSubmit} className="mb-6 p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 animation-fade-in">
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    value={selectedSlot} 
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-700"
                  >
                    {mealSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                  <input 
                    type="text"
                    placeholder="Type customized dish name or macro set profile..."
                    value={newMealText}
                    onChange={(e) => setNewMealText(e.target.value)}
                    className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-700 placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2 text-xs font-bold">
                  <button type="button" onClick={() => setIsAddingMeal(false)} className="px-3 py-1.5 text-slate-400 hover:text-slate-600 transition">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition">Save Log</button>
                </div>
              </form>
            )}

            {/* Meal Slot Stack Render Vector */}
            <div className="space-y-4">
              {mealSlots.map((slot) => {
                const assignedMeal = meals[activeDay]?.[slot];
                return (
                  <div key={slot} className="group border border-slate-100 hover:border-slate-200/80 rounded-xl p-4 flex items-center justify-between transition gap-4 bg-slate-50/30">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl shadow-xs group-hover:text-orange-500 transition">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{slot}</span>
                        {assignedMeal ? (
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{assignedMeal}</p>
                        ) : (
                          <p className="text-xs italic text-slate-400 mt-1">Empty index. No meal drafted for this slot window.</p>
                        )}
                      </div>
                    </div>

                    {assignedMeal && (
                      <button 
                        onClick={() => handleClearSlot(activeDay, slot)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50/50 rounded-lg opacity-0 group-hover:opacity-100 transition duration-150"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expanded Week Matrix Preview Viewport */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 hidden md:block">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 text-slate-400">Weekly Blueprint Thumbnail View</h3>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div 
                  key={day} 
                  onClick={() => setActiveDay(day)}
                  className={`p-3 border rounded-xl cursor-pointer text-center space-y-1 transition ${
                    activeDay === day 
                      ? "bg-orange-50/40 border-orange-200/80" 
                      : "bg-white border-slate-100 hover:bg-slate-50/50"
                  }`}
                >
                  <span className="text-[11px] font-black block text-slate-700">{day.slice(0,3)}</span>
                  <div className="flex justify-center gap-0.5">
                    {mealSlots.map(s => (
                      <span key={s} className={`w-1.5 h-1.5 rounded-full ${meals[day]?.[s] ? "bg-emerald-400" : "bg-slate-200"}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Meta Aggregator Analytics Panels */}
        <div className="space-y-6">
          
          {/* Component Card A: Metabolic Targeting Computations */}
          <div className="bg-slate-900 border border-slate-950 text-white rounded-2xl p-5 relative overflow-hidden shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Target Daily Allotment
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Estimated Intake Energy</span>
                <div className="text-3xl font-black text-white tracking-tight mt-0.5">{MACROS.calories}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-zinc-800 pt-3 text-center">
                <div className="bg-zinc-800/40 border border-zinc-800 p-2 rounded-xl">
                  <Apple className="w-3.5 h-3.5 text-red-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase block">Protein</span>
                  <span className="text-xs font-black text-white mt-0.5 block">{MACROS.protein}</span>
                </div>
                <div className="bg-zinc-800/40 border border-zinc-800 p-2 rounded-xl">
                  <Flame className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase block">Carbs</span>
                  <span className="text-xs font-black text-white mt-0.5 block">{MACROS.carbs}</span>
                </div>
                <div className="bg-zinc-800/40 border border-zinc-800 p-2 rounded-xl">
                  <Droplet className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase block">Fats</span>
                  <span className="text-xs font-black text-white mt-0.5 block">{MACROS.fats}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Component Card B: Consolidated Automated Shopping List */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-slate-400" /> Auto-Compiled Cart
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-md">
                {SHOPPING_LIST.length} Elements
              </span>
            </div>

            <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {SHOPPING_LIST.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/30 transition px-1">
                  <div>
                    <span className="font-semibold text-slate-800 block">{item.ingredient}</span>
                    <span className="text-[9px] text-slate-400 font-medium tracking-wide uppercase mt-0.5 block">{item.category}</span>
                  </div>
                  <span className="font-mono bg-slate-50 px-2 py-1 border border-slate-100 rounded-md font-bold text-slate-600 text-[10px]">
                    {item.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}