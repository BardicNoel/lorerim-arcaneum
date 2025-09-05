# V2 Skill Indexing Integration Checklist

## 🎯 **V2 Skill Indexing Integration Checklist**

### **Core Infrastructure** ✅
- [x] **Create skill indexing system** - `src/shared/data/skillIndex.ts`
- [x] **Create comprehensive tests** - `src/shared/data/__tests__/skillIndex.test.ts`

### **Type System Updates** 📝
- [x] **Update v2 type definitions** to use skill indexing and compressed property names
- [ ] **Update BuildState interfaces** to use skill indexes and compressed subfields
- [ ] **Update DEFAULT_BUILD** to use skill indexes and compressed format
- [ ] **Remove userProgress field** entirely from all interfaces
- [ ] **Implement conditional traitLimits** (only include if different from defaults)

### **Migration & Encoding** 🔄
- [ ] **Update v2 migration functions** to handle skill indexing and compressed format
- [ ] **Update v2 encoding/decoding** to use skill indexing and compressed property names
- [ ] **Update compactPerkEncoding.ts** to use skill indexes instead of skill codes
- [ ] **Update urlEncoding.ts** to handle skill indexes and compressed format
- [ ] **Implement conditional traitLimits encoding** (omit if default values)

### **Core Application Logic** ⚙️
- [ ] **Update character store** to work with skill indexes and compressed format
- [ ] **Update skill level calculations** to use skill indexes
- [ ] **Update perk selection logic** to use skill indexes
- [ ] **Update URL sync** to handle v2 with skill indexing and compressed format
- [ ] **Update all subfield references** to use compressed names (ma/mi, r/b, h/st/m/l/as)
- [ ] **Remove userProgress references** throughout the codebase

### **Integration Points** 🔗
- [ ] **Update Discord export** to convert skill indexes back to names and handle compressed format
- [ ] **Update GigaPlanner integration** to handle skill indexes and compressed format
- [ ] **Update build export/import** to handle compressed format

### **Testing & Validation** 🧪
- [ ] **Create v2 skill indexing tests**
- [ ] **Create v2 compressed format tests**
- [ ] **Run comprehensive tests** to ensure skill indexing and compression integration works
- [ ] **Test URL persistence** with skill indexing and compressed format
- [ ] **Test build export/import** with skill indexing and compressed format
- [ ] **Test conditional traitLimits** (default vs custom values)

### **Documentation & Cleanup** 📚
- [ ] **Update documentation** to reflect skill indexing changes
- [ ] **Clean up temporary files** and update compact.md

---

## **Progress Summary**
- **Completed**: 3/25 tasks (12%)
- **In Progress**: 0/25 tasks (0%)
- **Remaining**: 22/25 tasks (88%)

## **Next Steps**
1. Start with type system updates
2. Update BuildState interfaces
3. Update DEFAULT_BUILD
4. Work through migration and encoding updates
5. Update core application logic
6. Test and validate all changes

## **Key Benefits of This Approach**
- **Eliminates skill reference duplication** across different fields
- **Massive URL size reduction** (92% for skill references + 85% for property names)
- **Consistent skill naming** throughout the application
- **Future-proof** for adding new skills
- **Integrated into v2** instead of creating separate v3
- **Additional optimizations**: Removed userProgress, compressed subfields, conditional traitLimits
- **Total estimated savings**: ~219 characters per build
