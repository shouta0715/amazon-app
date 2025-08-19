#!/bin/bash

# R2バケット名
BUCKET_NAME="amazon-r2-bucket"

# アセットフォルダのパス
ASSETS_DIR="src/assets/products"

echo "📁 アセットをR2にアップロード中..."
echo "バケット: $BUCKET_NAME"
echo "ソース: $ASSETS_DIR"
echo ""

# カウンター
success_count=0
error_count=0

# アセットフォルダ内の各ファイルをアップロード
for file in "$ASSETS_DIR"/*; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    extension="${filename##*.}"
    
    # ファイルタイプに応じてR2のフォルダを決定
    case "$extension" in
      jpg|jpeg|png|gif|webp)
        r2_path="$BUCKET_NAME/images/$filename"
        ;;
      glb)
        r2_path="$BUCKET_NAME/models/$filename"
        ;;
      json)
        r2_path="$BUCKET_NAME/data/$filename"
        ;;
      *)
        r2_path="$BUCKET_NAME/data/$filename"
        ;;
    esac
    
    echo "📤 アップロード中: $filename → $r2_path"
    
    # wrangler r2 object put でアップロード
    if wrangler r2 object put "$r2_path" --file="$file"; then
      echo "✅ 成功: $r2_path"
      ((success_count++))
    else
      echo "❌ 失敗: $filename"
      ((error_count++))
    fi
    echo ""
  fi
done

echo "🎉 アップロード完了!"
echo "✅ 成功: $success_count ファイル"
echo "❌ 失敗: $error_count ファイル"
echo ""
echo "📂 R2バケット構造:"
echo "$BUCKET_NAME/"
echo "├── images/     # 画像ファイル"
echo "├── models/     # GLBファイル"
echo "└── data/       # その他のファイル"
