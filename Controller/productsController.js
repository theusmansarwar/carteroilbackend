const Product = require("../Models/productModel");


// Create Product
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      short_description,
      metaDescription,
      slug,
      bgImage,
      published,
    } = req.body;

    const missingFields = [];
    const isPublished = published === "true" || published === true;

    // ✅ Validate required only if publishing
    if (isPublished) {
      if (!title) missingFields.push({ name: "title", message: "Title is required" });
      if (!description) missingFields.push({ name: "description", message: "Description is required" });
      if (!short_description) missingFields.push({ name: "short_description", message: "Short description is required" });
      if (!metaDescription) missingFields.push({ name: "metaDescription", message: "Meta description is required" });
      if (!slug) missingFields.push({ name: "slug", message: "Slug is required" });
      if (!bgImage) missingFields.push({ name: "bgImage", message: "bgImage is required" });
    }

    if (missingFields.length > 0) {
      return res.status(400).json({ status: 400, message: "Validation failed", missingFields });
    }

    // ✅ Check duplicates
    const [existingTitle, existingSlug] = await Promise.all([
      title ? Product.findOne({ title }) : null,
      slug ? Product.findOne({ slug }) : null,
    ]);
    if (existingTitle) missingFields.push({ name: "title", message: "Title already exists" });
    if (existingSlug) missingFields.push({ name: "slug", message: "Slug already exists" });

    if (missingFields.length > 0) {
      return res.status(400).json({ status: 400, message: "Validation failed", missingFields });
    }

    const newProduct = await Product.create({
      title,
      description,
      short_description,
      metaDescription,
      slug,
      bgImage,
    
      published: isPublished,
    });

    res.status(201).json({ status: 201, message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      short_description,
      metaDescription,
      slug,
      bgImage,
      published,
      faqs,
      benefits,
      subproducts,
      innovation,
      performance
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const missingFields = [];
    const isPublished = published === "true" || published === true;

    // 🔍 Validate top-level if published
    if (isPublished) {
      if (!title) missingFields.push({ name: "title", message: "Title is required" });
      if (!description) missingFields.push({ name: "description", message: "Description is required" });
      if (!metaDescription) missingFields.push({ name: "metaDescription", message: "Meta description is required" });
      if (!slug) missingFields.push({ name: "slug", message: "Slug is required" });
      if (!bgImage) missingFields.push({ name: "bgImage", message: "bgImage is required" });
    }

    // 🔍 Validate FAQs
    if (faqs) {
      const parsed = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
      if (parsed.published === true || parsed.published === "true") {
        if (!parsed.title) missingFields.push({ name: "faqs.title", message: "FAQs title is required" });
        if (!parsed.description) missingFields.push({ name: "faqs.description", message: "FAQs description is required" });
        if (!parsed.image) missingFields.push({ name: "faqs.image", message: "FAQs image is required" });
      }
    }

    // 🔍 Validate Benefits
    if (benefits) {
      const parsed = typeof benefits === "string" ? JSON.parse(benefits) : benefits;
      if (parsed.published === true || parsed.published === "true") {
        if (!parsed.description) missingFields.push({ name: "benefits.description", message: "Benefits description is required" });
        if (!parsed.image1) missingFields.push({ name: "benefits.image1", message: "Benefits image1 is required" });
        if (!parsed.image2) missingFields.push({ name: "benefits.image2", message: "Benefits image2 is required" });
      }
    }
     if (performance) {
      const parsed = typeof performance === "string" ? JSON.parse(performance) : performance;
      if (parsed.published === true || parsed.published === "true") {
        if (!parsed.description) missingFields.push({ name: "performance.description", message: "Performance description is required" });
        if (!parsed.title) missingFields.push({ name: "performance.title", message: "Performance title is required" });
      }
    }

    // 🔍 Validate Subproducts
    if (subproducts) {
      const parsed = typeof subproducts === "string" ? JSON.parse(subproducts) : subproducts;
      if (parsed.published === true || parsed.published === "true") {
        if (!parsed.description) missingFields.push({ name: "subproducts.description", message: "Subproducts description is required" });
      }
    }

    // 🔍 Validate Innovation
    if (innovation) {
      const parsed = typeof innovation === "string" ? JSON.parse(innovation) : innovation;
      if (parsed.published === true || parsed.published === "true") {
        if (!parsed.title) missingFields.push({ name: "innovation.title", message: "Innovation title is required" });
        if (!parsed.description) missingFields.push({ name: "innovation.description", message: "Innovation description is required" });
        if (!parsed.yearsOfExperience) missingFields.push({ name: "innovation.yearsOfExperience", message: "Years of Experience is required" });
        if (!parsed.image1) missingFields.push({ name: "innovation.image1", message: "Innovation image1 is required" });
        if (!parsed.image2) missingFields.push({ name: "innovation.image2", message: "Innovation image2 is required" });
         if (!parsed.rating) missingFields.push({ name: "innovation.rating", message: "Innovation rating is required" });
        if (!parsed.noOfRatings) missingFields.push({ name: "innovation.noOfRatings", message: "Innovation noOfRatings is required" });
      }
    }

    // ❌ Stop if something is missing
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Some fields are missing!",
        missingFields,
      });
    }

    // ✅ Now apply updates (your merge logic stays the same)
    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.short_description = short_description ?? product.short_description;
    product.metaDescription = metaDescription ?? product.metaDescription;
    product.slug = slug ?? product.slug;
    product.bgImage = bgImage ?? product.bgImage;
    product.published = isPublished;

    // (merge faqs, benefits, subproducts, innovation as you already did)

    // Merge FAQs
if (faqs) {
  const parsed = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
  product.faqs = {
    ...product.faqs.toObject(),
    ...parsed,
  };
}

// Merge Benefits
if (benefits) {
  const parsed = typeof benefits === "string" ? JSON.parse(benefits) : benefits;
  product.benefits = {
    ...product.benefits.toObject(),
    ...parsed,
  };
}
if (performance) {
  const parsed = typeof performance === "string" ? JSON.parse(performance) : performance;
  product.performance = {
    ...product.performance.toObject(),
    ...parsed,
  };
}

// Merge Subproducts
if (subproducts) {
  const parsed = typeof subproducts === "string" ? JSON.parse(subproducts) : subproducts;
  product.subproducts = {
    ...product.subproducts.toObject(),
    ...parsed,
  };
}

// Merge Innovation
if (innovation) {
  const parsed = typeof innovation === "string" ? JSON.parse(innovation) : innovation;
  product.innovation = {
    ...product.innovation.toObject(),
    ...parsed,
  };
}

    await product.save();

    res.status(200).json({
      status: 200,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// Admin list
const listProductsAdmin = async (req, res) => {
  try {
    const { title } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let filter = {};
    if (title) filter.title = { $regex: title, $options: "i" };

    const products = await Product.find(filter)
      .select("title short_description published createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      products,
    });
  } catch (error) {
    console.error("Error fetching products (Admin):", error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
};

// Public list
const listProducts = async (req, res) => {
  try {
    const { title } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let filter = { published: true };
    if (title) filter.title = { $regex: title, $options: "i" };

    const products = await Product.find(filter)
      .select("title short_description slug bgImage createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
};

// Get by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("faqs.items", "question answer")
      .populate("benefits.items", "title description")
      .populate("subproducts.items", "title description image");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ status: 200, message: "Product fetched successfully", product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
};

// Get by Slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, published: true })
      .populate("faqs.items", "question answer")
      .populate("benefits.items", "title description bgImage")
      .populate("subproducts.items", "title description image");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ status: 200, message: "Product fetched successfully", product });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
};

// Delete many
const deleteAllProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ message: "Invalid request. Provide product IDs." });

    await Product.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ status: 200, message: "Products deleted successfully" });
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
};

// Get all slugs
const getProductsSlugs = async (req, res) => {
  try {
    const list = await Product.find({ published: true })
      .select("slug _id title")
      .sort({ createdAt: -1 });

    res.status(200).json({ totalProducts: list.length, slugs: list });
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  listProductsAdmin,
  listProducts,
  getProductById,
  getProductBySlug,
  deleteAllProducts,
  getProductsSlugs,
};
