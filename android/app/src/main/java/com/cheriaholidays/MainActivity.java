package com.cheriaholidays;


import android.graphics.DrawFilter;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.media.Image;
import android.view.ViewGroup;
import android.widget.ImageView;
 import android.widget.LinearLayout;
 import android.graphics.Color;
 import android.widget.TextView;
 import android.view.Gravity;
 import android.util.TypedValue;
 import android.widget.RelativeLayout;

 import com.reactnativenavigation.controllers.SplashActivity;

 public class MainActivity extends SplashActivity {
    @Override
    public RelativeLayout createSplashLayout(){
        // LinearLayout view = new LinearLayout(this);
        RelativeLayout view = new RelativeLayout(this);
        TextView textView = new TextView(this);

        ImageView imageView = new ImageView(this);
        view.setLayoutParams(new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        // view.setOrientation(LinearLayout.VERTICAL);
        // view.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        // view.setBackgroundColor(Color.parseColor("white"));
        // view.setGravity(Gravity.CENTER_VERTICAL);
        view.setGravity(Gravity.CENTER);

        // untuk penuh satu layar
        // view.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));

        // imageView.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        imageView.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
        // imageView.setScaleType(ImageView.ScaleType.FIT_XY);

        imageView.setScaleType(ImageView.ScaleType.FIT_XY);
        // untuk penuh satu layar
 
        imageView.setImageResource(R.mipmap.splash);
        view.addView(imageView);

        return view;
    }
 }
